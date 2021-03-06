function script_newPurchaseOrder() {
    var select_customerAccounts;
    var select_paymentTerms;
    var select_products, field_newProductQty, button_addOrderLine;
    var label_actionInfo, container_normalMode, button_deleteMode, button_editMode,
        container_editMode, button_saveEdit, button_cancelEdit,
        container_deleteMode, button_deleteSelected, button_cancelDelete;
    var table_orderLines;
    var container_discountPercent, container_discountAmount,
        select_discountType, field_discountPercent, field_discountAmount;
    var label_subtotal, label_discount, label_total;
    var select_status;

    var mainForm_purchaseDate,
        mainForm_customerAccountID,
        mainForm_subtotal,
        mainForm_negotiatedPrice,
        mainForm_discountAmount,
        mainForm_paymentTerms,
        mainForm_dueDate,
        mainForm_outstandingBalance,
        mainForm_dateFulfilled;

    var observer_customerAccounts = new MutationObserver(function () {
        if (select_customerAccounts.dropdown('get value') !== '') {
            if (select_customerAccounts.find('input').val() === '') {
                 select_customerAccounts.dropdown('set text', select_customerAccounts.find('.menu .item.active .title.text').html());
            } else {
                 select_customerAccounts.dropdown('set text', '');
            }
        }
    });
    var observer_products = new MutationObserver(function () {
        if (select_products.dropdown('get value') !== '') {
            if (select_products.find('input').val() === '') {
                select_products.dropdown('set text', select_products.find('.menu .item.active .title.text').html() + ' (' + select_products.find('.menu .item.active .value.specs').html() + ')');
            } else {
                select_products.dropdown('set text', '');
            }
        }
    });

    $(document).ready(function() {
        select_customerAccounts = $('#select-customerAccounts');
        
        select_paymentTerms = $('#select-paymentTerms');

        select_products = $('#select-products');
        button_addOrderLine = $('#button-addOrderLine');
        field_newProductQty = $('#field-newProductQty');

        label_actionInfo = $('#label-actionInfo');
        container_normalMode = $('.normal-mode-buttons-container');
        button_deleteMode = $('#button-deleteMode');
        button_editMode = $('#button-editMode');
        container_editMode = $('.edit-mode-buttons-container');
        button_saveEdit = $('#button-editMode-save');
        button_cancelEdit = $('#button-editMode-cancel');
        container_deleteMode = $('.delete-mode-buttons-container');
        button_deleteSelected = $('#button-deleteMode-delete');
        button_cancelDelete = $('#button-deleteMode-cancel');

        table_orderLines = $('#table-orderLines');
        check_selectAll = $('#check-selectAll');
        
        select_discountType = $('#select-discountType');
        container_discountPercent = $('.discount-field-percent-container');
        field_discountPercent = $('#field-discountPercent');
        container_discountAmount = $('.discount-field-amount-container');
        field_discountAmount = $('#field-discountAmount');

        label_discount = $('#label-discount');
        label_subtotal = $('#label-subtotal');
        label_total = $('#label-total');

        select_status = $('#select-status');
        container_dateFulfilled = $('.date-fulfilled-container');

        mainForm_purchaseDate = $('#purchase_order_purchase_date');
        mainForm_customerAccountID = $('#purchase_order_customer_account_id');
        mainForm_subtotal = $('#purchase_order_subtotal');
        mainForm_discount = $('#purchase_order_discount');
        mainForm_negotiatedPrice = $('#purchase_order_negotiated_price');
        mainForm_paymentTerms = $('#purchase_order_payment_terms');
        mainForm_outstandingBalance = $('#purchase_order_outstanding_balance');
        mainForm_dueDate = $('#purchase_order_due_date');
        mainForm_dateFulfilled = $('#purchase_order_date_fulfilled');

        /** CUSTOMER SELECTOR */
            /** MutationObserver is used to detect changes in the dropdown. Once a change is detected, 
             * the dropdown text is adjusted to show only the title text. Applies to select_products as well.
             */
            observer_customerAccounts.observe(select_customerAccounts.find('.menu')[0], {childList: true, subtree: true, attributes: true, characterData: true});
            select_customerAccounts.dropdown({
                fullTextSearch: true,
                forceSelection: false,
                onHide: function() {
                    mainForm_customerAccountID.val($(this).dropdown('get value'));
                }
            });

        /** PAYMENT TERMS */
            function computeDueDate() {
                var newDate, formattedDate;
                if (select_paymentTerms.dropdown('get value') == '30-days') {
                    newDate = new Date(mainForm_purchaseDate.val()).addDays(30);
                } else if (select_paymentTerms.dropdown('get value') == '60-days') {
                    newDate = new Date(mainForm_purchaseDate.val()).addDays(60);
                } else if (select_paymentTerms.dropdown('get value') == '90-days') {
                    newDate = new Date(mainForm_purchaseDate.val()).addDays(90);
                } else if (select_paymentTerms.dropdown('get value') == 'paid') {
                    newDate = new Date(mainForm_purchaseDate.val());
                }

                formattedDate = newDate.getFullYear()
                    + '-' + ((newDate.getMonth() + 1) < 10 ? ('0' + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1))
                    + '-' + ((newDate.getDate()) < 10 ? ('0' + newDate.getDate()) : (newDate.getDate()));

                mainForm_paymentTerms.val(select_paymentTerms.dropdown('get value'));
                mainForm_dueDate.val(formattedDate);
            }
            select_paymentTerms.dropdown({
                onChange: function() {
                    computeDueDate();
                    computeOutstandingBalance();
                }
            });
            mainForm_purchaseDate.on('input change', function() {
                computeDueDate();
            });

        /** ADD PRODUCT FIELDS  */
            observer_products.observe(select_products.find('.menu')[0], {childList: true, subtree: true, attributes: true, characterData: true});
            
            function validateSelectedProductAndQty() {
                if (select_products.dropdown('get value') === '' || field_newProductQty.val() === '') {
                    button_addOrderLine.addClass('disabled');
                } else {
                    button_addOrderLine.removeClass('disabled');
                }
            }

            select_products.dropdown({
                fullTextSearch: true,
                forceSelection: false,
                onHide: function() {
                    field_newProductQty.focus();
                    field_newProductQty.select();
                    validateSelectedProductAndQty();
                },
            });
            field_newProductQty.on('input', function() {
                validateSelectedProductAndQty();
            });

        /** ORDER LINE TABLE ACTIONS */
            function enterEditMode() {
                container_normalMode.css('display', 'none');
                container_editMode.css('display', 'block');
                setEnableOfAddProductFields(false);

                label_actionInfo.html('<b>Edit:</b> Use the field on each row to edit the quantity of an item.');

                /** Create an input field in the Qty. column of each row and set its value to
                 * the current set quantity of its item.
                 */
                table_orderLines.find('tbody .order-line-item').each(function() {
                    $(this).find('.col-qty').html('<input id="field-editQty" type="number" min="1" value="1">');
                    $(this).find('#field-editQty').val($(this).find('.main-form.qty').val());

                     /** onInput() event for each edit-Qty. field.  */
                    $(this).find('#field-editQty').on('input', function() {
                        var orderLineItem = $('#field-editQty').parent().parent();
                        orderLineItem.find('.col-order-price').html(toPriceString(orderLineItem.find('#field-editQty').val() * getPriceValue(orderLineItem.find('.col-unit-price').html())));
                        computeSubtotal();
                        computeDiscount();
                        computeTotal();
                    });
                });
            }
            function exitEditMode(save) {
                table_orderLines.find('tbody .order-line-item').each(function() {
                    if (save === true) {
                        $(this).find('.main-form.qty').val($(this).find('#field-editQty').val());
                    }   
                    $(this).find('.col-qty').html($(this).find('.main-form.qty').val());
                });
                container_normalMode.css('display', 'block');
                container_editMode.css('display', 'none');
                setEnableOfAddProductFields(true);

                updateTableWithCurrentQty();
                updateAllPrices();
            }
            function enterDeleteMode() {
                container_normalMode.css('display', 'none');
                container_deleteMode.css('display', 'block');
                table_orderLines.find('.col-checkbox').css('display', 'table-cell');
                table_orderLines.find('.col-particulars').css('border-left-width', '1px');
                setEnableOfAddProductFields(false);

                label_actionInfo.html('<b>Delete:</b> Select the items you want to delete.');
                button_deleteSelected.addClass('disabled');
                button_deleteSelected.find('.selected-count').html('');

                /** Uncheck all checkboxes */
                check_selectAll.checkbox('set unchecked');
                table_orderLines.find('tbody .order-line-item').each(function() {
                    table_orderLines.find('tbody .order-line-item').each(function() {
                        $(this).find('.col-checkbox #check-itemSelect').checkbox('set unchecked');
                    });
                });

                /** Event configuration for checkboxes used to select products for deletion. */
                table_orderLines.find('tbody .order-line-item #check-itemSelect').checkbox({
                    onChecked: function() {
                        var allIsChecked = true;
                        table_orderLines.find('tbody .order-line-item').each(function() {
                            if ($(this).find('#check-itemSelect').checkbox('is checked') == false) {
                                allIsChecked = false;
                            }
                        });
                        if (allIsChecked == true) {
                            check_selectAll.checkbox('set checked');
                        } else {
                            check_selectAll.checkbox('set indeterminate');
                        }
                    },
                    onUnchecked: function() {
                        var allIsUnchecked = true;
                        table_orderLines.find('tbody .order-line-item').each(function() {
                            if ($(this).find('#check-itemSelect').checkbox('is unchecked') == false) {
                                allIsUnchecked = false;
                            }
                        });
                        if (allIsUnchecked == true) {
                            check_selectAll.checkbox('set unchecked');
                        } else {
                            check_selectAll.checkbox('set indeterminate');
                        }
                    },
                    onChange: function() {
                        var countSelected = 0;
                        table_orderLines.find('tbody .order-line-item').each(function() {
                            if ($(this).find('#check-itemSelect').checkbox('is checked') == true) {
                                countSelected += 1;
                            }
                        });
                        if (countSelected === 0) {
                            button_deleteSelected.addClass('disabled');
                            button_deleteSelected.find('.selected-count').html('');
                        } else {
                            button_deleteSelected.removeClass('disabled');
                            button_deleteSelected.find('.selected-count').html(' (' + countSelected + ')');
                        }
                    }
                });

            }
            function exitDeleteMode(save) {
                table_orderLines.find('tbody .order-line-item').each(function() {
                    if (save === true) {
                        if ($(this).find('.col-checkbox #check-itemSelect').checkbox('is checked') === true) {
                            $(this).find('#button-removeItem').click();
                        }
                    }
                });
                container_normalMode.css('display', 'block');
                container_deleteMode.css('display', 'none');
                $('.col-checkbox').css('display', 'none');
                $('.col-particulars').css('border-left-width', '0');

                setEnableOfAddProductFields(true);

                updateTableWithCurrentQty();
                updateAllPrices();
            }
            function setEnableOfAddProductFields(enabled) {
                if (enabled === false) {
                    select_products.addClass('disabled');
                    $('.select-qty-label').addClass('text-label disabled');
                    /** Targets .parent() because of Semantic UI Structure */
                    field_newProductQty.parent().addClass('disabled');
                    button_addOrderLine.addClass('disabled');
                } else {
                    select_products.removeClass('disabled');
                    $('.select-qty-label').removeClass('text-label disabled');
                    field_newProductQty.parent().removeClass('disabled');
                    button_addOrderLine.removeClass('disabled');
                }
            }
            function updateProductSelectorItems(item, action) { 
                if (action.toLowerCase() === 'after-insert') {
                    select_products.find('.menu .item').each(function() {
                        if ($(this).data('value') == item.find('.main-form.product-id').val()) {
                            $(this).css('display', 'none');
                        }
                    });
                } else if (action.toLowerCase() === 'after-remove') {
                    select_products.find('.menu .item').each(function() {
                        if ($(this).data('value') == item.find('.main-form.product-id').val()) {
                            $(this).css('display', 'block');
                        }
                    });
                }
                select_products.dropdown('clear');
                field_newProductQty.val('');
                validateSelectedProductAndQty();
            }
            function updateTableWithCurrentQty() {
                var itemCount = 0;
                table_orderLines.find('tbody .order-line-item').each(function() { itemCount += 1; });

                /** label_actionInfo */
                if (itemCount === 0) {
                    label_actionInfo.html('Select a product to add from the dropdown.');
                } else if (itemCount === 1) {
                    label_actionInfo.html(itemCount + ' item added.');
                } else {
                    label_actionInfo.html(itemCount + ' items added.');
                }

                if (itemCount > 0) {
                    button_deleteMode.removeClass('disabled');
                    button_editMode.removeClass('disabled');
                    table_orderLines.css('border-bottom-width', '1px');

                    setEnableOfDiscountFields(true);
                } else {
                    button_deleteMode.addClass('disabled');
                    button_editMode.addClass('disabled');
                    table_orderLines.css('border-bottom-width', '0');

                    setEnableOfDiscountFields(false);
                }
            }

            /**  */
            button_editMode.click(function() { enterEditMode(); });
            button_deleteMode.click(function() { enterDeleteMode(); });
            button_saveEdit.click(function() { exitEditMode(true); });
            button_cancelEdit.click(function() { exitEditMode(false); });
            button_deleteSelected.click(function() { exitDeleteMode(true); });
            button_cancelDelete.click(function() { exitDeleteMode(false); });
            check_selectAll.checkbox({
                onChecked: function() {
                    table_orderLines.find('tbody .order-line-item').each(function() {
                        $(this).find('.col-checkbox #check-itemSelect').checkbox('check');
                    });
                },
                onUnchecked: function() {
                    table_orderLines.find('tbody .order-line-item').each(function() {
                        $(this).find('.col-checkbox #check-itemSelect').checkbox('uncheck');
                    });
                }
            });    

        /** ORDER LINE TABLE */
            function writeProductIDAndQtyToNewOrderLineItem(item) {
                var mainForm_orderLineProductID = item.find('.main-form.product-id');
                var mainForm_orderLineQty = item.find('.main-form.qty');
                var productData = {};

                /** Assign values to main Product ID and Qty. fields if empty */
                if (mainForm_orderLineProductID.val() === '') {
                    mainForm_orderLineProductID.val(select_products.dropdown('get value'));
                }
                if (mainForm_orderLineQty.val() === '') {  
                    mainForm_orderLineQty.val(field_newProductQty.val());
                }

                /** Extract data from Product Selector */
                select_products.find('.menu .item').each(function() {
                    if ($(this).data('value') == mainForm_orderLineProductID.val()) {
                        productData.productName = $(this).find('#val-productName').html();
                        productData.productSpecs = $(this).find('#val-productSpecs').html();
                        productData.unitPrice = $(this).find('#val-unitPrice').html();
                    }
                });
                
                /** Assign values to Columns */
                item.find('.col-particulars').html(productData.productName + ' (' + productData.productSpecs + ')');
                item.find('.col-unit-price').html(productData.unitPrice)
                item.find('.col-qty').html(mainForm_orderLineQty.val());
                item.find('.col-order-price').html(toPriceString(mainForm_orderLineQty.val() * getPriceValue(productData.unitPrice)));
            }
            function computeOrderPrices() {
                table_orderLines.find('tbody .order-line-item').each(function() {
                    if ($(this).find('.col-qty #field-editQty').length > 0) {
                        $(this).find('.col-order-price').html(toPriceString($(this).find('#field-editQty').val() * getPriceValue($(this).find('.col-unit-price').html())));
                    } else {
                        $(this).find('.col-order-price').html(toPriceString($(this).find('.main-form.qty').val() * getPriceValue($(this).find('.col-unit-price').html())));
                    }
                    $(this).find('.main-form.order-price').val(getPriceValue($(this).find('.col-order-price').html()));
                });
            }

            table_orderLines.on('cocoon:after-insert', function(e, insertedItem) {
                writeProductIDAndQtyToNewOrderLineItem(insertedItem);
                updateProductSelectorItems(insertedItem, 'after-insert');
                updateTableWithCurrentQty();
                updateAllPrices();
            });
            table_orderLines.on('cocoon:after-remove', function(e, removedItem) {
                updateProductSelectorItems(removedItem, 'after-remove');
                updateTableWithCurrentQty();
                updateAllPrices();
            });

        /** SUBTOTAL, DISCOUNT, AND TOTAL */
            function setEnableOfDiscountFields(enabled) {
                if (enabled === false)  {
                    $('.discount-type-label-container span').addClass('text-label disabled');
                    select_discountType.addClass('disabled');
                    $('.discount-info-label').addClass('text-label disabled');
                    label_discount.addClass('text-label disabled');
                } else {
                    $('.discount-type-label-container span').removeClass('text-label disabled');
                    select_discountType.removeClass('disabled');
                    $('.discount-info-label').removeClass('text-label disabled');
                    label_discount.removeClass('text-label disabled');
                }
            }
            function computeSubtotal() {
                computeOrderPrices();
                var subtotal = 0;
                table_orderLines.find('tbody .order-line-item').each(function() {
                    subtotal += getPriceValue($(this).find('.main-form.order-price').val());
                });
                label_subtotal.html(toPriceString(subtotal));
                mainForm_subtotal.val(subtotal);
            }
            function computeTotal() {
                label_total.html(toPriceString(getPriceValue(label_subtotal.html()) - getPriceValue(label_discount.html())));
                mainForm_negotiatedPrice.val(getPriceValue(label_total.html()));
            }
            function computeDiscount() {
                var discount = 0;
                if (select_discountType.dropdown('get value') === 'percent') {
                    discount = getPriceValue(label_subtotal.html()) * (field_discountPercent.val() / 100);
                } else if (select_discountType.dropdown('get value') === 'amount') {
                    discount = getPriceValue(field_discountAmount.val());
                }
                mainForm_discount.val(discount);
                label_discount.html(toPriceString(mainForm_discount.val()));

                if (isNaN(getPriceValue(label_discount.html()))) {
                    label_discount.html('0.00');
                }

                mainForm_discount.val(getPriceValue(label_discount.html()));
            }
            function computeOutstandingBalance() {
                if (select_paymentTerms.dropdown('get value') == 'paid') {
                    mainForm_outstandingBalance.val(0);
                } else {
                    mainForm_outstandingBalance.val(mainForm_negotiatedPrice.val());
                }
            }
            function updateAllPrices() {
                computeOrderPrices();
                computeSubtotal();
                computeDiscount();
                computeTotal();
                computeOutstandingBalance();
            }
            select_discountType.dropdown({
                onChange: function() {
                    field_discountPercent.val('');
                    field_discountAmount.val('');
                    label_discount.html('0.00');
                    computeDiscount();
                    computeTotal();
                    computeOutstandingBalance();
                    if ($(this).dropdown('get value') === 'none') {
                        $('.discount-value-label-container span').css('display', 'none');
                        container_discountAmount.css('display', 'none');
                        container_discountPercent.css('display', 'none');
                    } else if ($(this).dropdown('get value') === 'percent') {
                        $('.discount-value-label-container span').css('display', 'block');
                        container_discountAmount.css('display', 'none');
                        container_discountPercent.css('display', 'inline-flex');
                        field_discountPercent.focus();
                    } else if ($(this).dropdown('get value') === 'amount') {
                        $('.discount-value-label-container span').css('display', 'block');
                        container_discountAmount.css('display', 'inline-flex');
                        container_discountPercent.css('display', 'none');
                        field_discountAmount.focus();
                    }
                }
            });
            field_discountPercent.on('input', function() {
                computeDiscount();
                computeTotal();
                computeOutstandingBalance();
            });
            field_discountAmount.on('input', function() {
                computeDiscount();
                computeTotal();
                computeOutstandingBalance();
            });

        /** PAYMENT TERMS */
            select_status.dropdown({
                onChange: function() {
                    if ($(this).dropdown('get value') == 'unfulfilled') {
                        container_dateFulfilled.css('display', 'none');
                    } else if ($(this).dropdown('get value') == 'fulfilled') {
                        container_dateFulfilled.css('display', 'block');
                    }
                    mainForm_dateFulfilled.val('');
                }
            })
    });
}

if (getLastSegmentOfCurrentPath() === 'new') {
    script_newPurchaseOrder();
}
