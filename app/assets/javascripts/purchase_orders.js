function view_form_partial() {
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
        mainForm_discountType,
        mainForm_discount,
        mainForm_paymentTerms,
        mainForm_dueDate,
        mainForm_dateFulfilled,
        mainForm_status;

    function script() {
        select_customerAccounts = $('.view-form-partial #select-customerAccounts');
        
        select_paymentTerms = $('.view-form-partial #select-paymentTerms');

        select_products = $('.view-form-partial #select-products');
        button_addOrderLine = $('.view-form-partial #button-addOrderLine');
        field_newProductQty = $('.view-form-partial #field-newProductQty');

        label_actionInfo = $('.view-form-partial #label-actionInfo');
        container_normalMode = $('.view-form-partial .normal-mode-buttons-container');
        button_deleteMode = $('.view-form-partial #button-deleteMode');
        button_editMode = $('.view-form-partial #button-editMode');
        container_editMode = $('.view-form-partial .edit-mode-buttons-container');
        button_saveEdit = $('.view-form-partial #button-editMode-save');
        button_cancelEdit = $('.view-form-partial #button-editMode-cancel');
        container_deleteMode = $('.view-form-partial .delete-mode-buttons-container');
        button_deleteSelected = $('.view-form-partial #button-deleteMode-delete');
        button_cancelDelete = $('.view-form-partial #button-deleteMode-cancel');

        table_orderLines = $('.view-form-partial #table-orderLines');
        check_selectAll = $('.view-form-partial #check-selectAll');
        
        select_discountType = $('.view-form-partial #select-discountType');
        container_discountPercent = $('.view-form-partial .discount-field-percent-container');
        field_discountPercent = $('.view-form-partial #field-discountPercent');
        container_discountAmount = $('.view-form-partial .discount-field-amount-container');
        field_discountAmount = $('.view-form-partial #field-discountAmount');

        label_discount = $('.view-form-partial #label-discount');
        label_subtotal = $('.view-form-partial #label-subtotal');
        label_total = $('.view-form-partial #label-total');

        select_status = $('.view-form-partial #select-status');
        container_dateFulfilled = $('.view-form-partial .date-fulfilled-container');

        mainForm_purchaseDate = $('.view-form-partial #purchase_order_purchase_date');
        mainForm_customerAccountID = $('.view-form-partial #purchase_order_customer_account_id');
        mainForm_subtotal = $('.view-form-partial #purchase_order_subtotal');
        mainForm_discountType = $('.view-form-partial #purchase_order_discount_type');
        mainForm_discount = $('.view-form-partial #purchase_order_discount');
        mainForm_negotiatedPrice = $('.view-form-partial #purchase_order_negotiated_price');
        mainForm_paymentTerms = $('.view-form-partial #purchase_order_payment_terms');
        mainForm_dueDate = $('.view-form-partial #purchase_order_due_date');
        mainForm_dateFulfilled = $('.view-form-partial #purchase_order_date_fulfilled');
        mainForm_status = $('.view-form-partial #purchase_order_status');

        var inEditMode = false;

        /** CUSTOMER SELECTOR */
            /** Since the Customer Account Selector is a shared dropdown, it is
             * initialized at shared.js. Therefore, any settings change will take on
             * the after-intialization format .dropdown('setting', <event>, function() {}).
             * 
             * Applies to the Product Selector, and other shared fields as well.
             */
            select_customerAccounts.dropdown('setting', 'onHide', function() {
                mainForm_customerAccountID.val($(this).dropdown('get value'));
            });

        /** PURCHASE DATE */
            mainForm_purchaseDate.on('input change', function() {
                computeDueDate();
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

                mainForm_paymentTerms.val(select_paymentTerms.dropdown('get value'));
                mainForm_dueDate.val(newDate.formatForDateField());
            }
            select_paymentTerms.dropdown({
                onChange: function() {
                    computeDueDate();
                }
            });

        /** ADD PRODUCT FIELDS  */
            function validateSelectedProductAndQty() {
                if (select_products.dropdown('get value') === '' || field_newProductQty.val() === '') {
                    button_addOrderLine.addClass('disabled');
                } else {
                    button_addOrderLine.removeClass('disabled');
                }
            }

            select_products.dropdown('setting', 'onHide', function() {
                field_newProductQty.focus();
                field_newProductQty.select();
                validateSelectedProductAndQty();
            });
            field_newProductQty.on('input', function() {
                validateSelectedProductAndQty();
            });

        /** ORDER LINE TABLE ACTIONS */
            function enterEditMode() {
                inEditMode = true;

                container_normalMode.css('display', 'none');
                container_editMode.css('display', 'block');
                setEnableOfAddProductFields(false);

                label_actionInfo.html('<b>Edit:</b> Use the field on each row to edit the quantity of an item.');

                /** Create an input field in the Qty. column of each row and set its value to
                 * the current set quantity of its item.
                 */
                table_orderLines.find('tbody .order-line-item').each(function() {
                    $(this).find('.col-qty').html('<div class="field"><input id="field-editQty" type="number" min="1" value="1"></div>');
                    $(this).find('#field-editQty').val($(this).find('.main-form.qty').val());

                     /** onInput() event for each edit-Qty. field.  */
                    $(this).find('#field-editQty').on('input', function() {
                        var orderLineItem = $('.view-form-partial #field-editQty').parent().parent().parent();
                        orderLineItem.find('.col-order-price').html(toPriceString(orderLineItem.find('#field-editQty').val() * getPriceValue(orderLineItem.find('.col-unit-price').html())));
                        computeSubtotal();
                        computeDiscount();
                        computeTotal();
                    });
                });
            }
            function exitEditMode(save) {
                $('#message-orderValidation').css('display', 'none');
                if (validateSaveEdit() === true) {
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
                    inEditMode = false;
                } else {
                    if (save != true) {
                        $('#message-orderValidation').css('display', 'none');
                        table_orderLines.find('tbody .order-line-item').each(function() {
                            $(this).find('.col-qty').html($(this).find('.main-form.qty').val());
                        });
                        container_normalMode.css('display', 'block');
                        container_editMode.css('display', 'none');
                        setEnableOfAddProductFields(true);
                        updateTableWithCurrentQty();
                        updateAllPrices();
                        inEditMode = false;
                    }
                }
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
                $('.view-form-partial .col-checkbox').css('display', 'none');
                $('.view-form-partial .col-particulars').css('border-left-width', '0');

                setEnableOfAddProductFields(true);

                updateTableWithCurrentQty();
                updateAllPrices();
            }
            function setEnableOfAddProductFields(enabled) {
                if (enabled === false) {
                    $('.view-form-partial .select-product-label').addClass('text-label disabled');
                    select_products.addClass('disabled');
                    $('.view-form-partial .select-qty-label').addClass('text-label disabled');
                    /** Targets .parent() because of Semantic UI Structure */
                    field_newProductQty.parent().addClass('disabled');
                    button_addOrderLine.addClass('disabled');
                } else {
                    $('.view-form-partial .select-product-label').removeClass('text-label disabled');
                    select_products.removeClass('disabled');
                    $('.view-form-partial .select-qty-label').removeClass('text-label disabled');
                    field_newProductQty.parent().removeClass('disabled');
                    button_addOrderLine.removeClass('disabled');
                }
            }
            function validateAddProduct() {
                $('#message-orderValidation').css('display', 'none');
                field_newProductQty.parent().removeClass('error');

                $('#message-orderValidation').find('.header').html('This product can\'t be added');

                if (field_newProductQty.val() <= 0 || isNaN(field_newProductQty.val())) {
                    $('#message-orderValidation').find('.content').html('Quantity must be a positive, non-zero integer.');
                    $('#message-orderValidation').find('.list').html('');
                    $('#message-orderValidation').css('display', 'block');
                    field_newProductQty.parent().addClass('error');
                    field_newProductQty.focus();
                    return false;
                } else if (field_newProductQty.val() % 1 !== 0) {
                    $('#message-orderValidation').find('.content').html('Quantity must be a whole number.');
                    $('#message-orderValidation').find('.list').html('');
                    $('#message-orderValidation').css('display', 'block');
                    field_newProductQty.parent().addClass('error');
                    field_newProductQty.focus();
                    return false;
                } else if (parseInt(field_newProductQty.val()) > parseInt(select_products.dropdown('get item', select_products.dropdown('get value')).find('#val-quantity').html())) {
                    $('#message-orderValidation').find('.content').html('Order Quantity can\'t be larger than the product\'s remaining quantity.');
                    $('#message-orderValidation').find('.list').html('');
                    $('#message-orderValidation').css('display', 'block');
                    field_newProductQty.parent().addClass('error');
                    field_newProductQty.focus();
                    return false;
                } else {
                    return true;
                }
            }
            function validateSaveEdit() {
                $('#message-orderValidation').css('display', 'none');

                $('#message-orderValidation').find('.header').html('The changes can\'t be saved');

                var result = true;

                table_orderLines.find('tbody .order-line-item').each(function() {
                     $(this).find('.col-qty #field-editQty').parent().removeClass('error');

                    if ($(this).find('.col-qty #field-editQty').val() <= 0 || isNaN($(this).find('.col-qty #field-editQty').val())) {
                        $('#message-orderValidation').find('.content').html('Quantity must be a positive, non-zero integer.');
                        $('#message-orderValidation').find('.list').html('');
                        $('#message-orderValidation').css('display', 'block');

                        $(this).find('.col-qty #field-editQty').parent().addClass('error');

                        result = false;
                    } else if ($(this).find('.col-qty #field-editQty').val() % 1 !== 0) {
                        $('#message-orderValidation').find('.content').html('Quantity must be a whole number.');
                        $('#message-orderValidation').find('.list').html('');
                        $('#message-orderValidation').css('display', 'block');
                        
                        $(this).find('.col-qty #field-editQty').parent().addClass('error');
                        
                        result = false;
                    } else if (parseInt($(this).find('.col-qty #field-editQty').val()) > parseInt(select_products.dropdown('get item', $(this).find('.main-form.product-id').val()).find('#val-quantity').html())) {
                        $('#message-orderValidation').find('.content').html('Order Quantity can\'t be larger than the product\'s remaining quantity.');
                        $('#message-orderValidation').find('.list').html('');
                        $('#message-orderValidation').css('display', 'block');
                        
                        $(this).find('.col-qty #field-editQty').parent().addClass('error');

                        result = false;
                    }
                });

                return result;
            }
            function updateProductSelectorItems(item, action) {
                if (action.toLowerCase() === 'after-insert') {
                    select_products.find('.menu .item').each(function() {
                        if ($(this).data('value') == item.find('.main-form.product-id').val()) {
                            $(this).addClass('disabled');
                        }
                    });
                } else if (action.toLowerCase() === 'after-remove') {
                    select_products.find('.menu .item').each(function() {
                        if ($(this).data('value') == item.find('.main-form.product-id').val()) {
                            $(this).removeClass('disabled');
                        }
                    });
                }
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
            function writeOrderLineItemAttributes(item) {
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
                item.find('.col-particulars').html(productData.productName);
                item.find('.col-unit-price').html(productData.unitPrice)
                item.find('.col-qty').html(mainForm_orderLineQty.val());
                item.find('.col-order-price').html(toPriceString(mainForm_orderLineQty.val() * getPriceValue(productData.unitPrice)));
            }
            function computeOrderPrices() {
                table_orderLines.find('tbody .order-line-item').each(function() {
                    if ($(this).css('display') !== 'none') {
                        if ($(this).find('.col-qty #field-editQty').length > 0) {
                        $(this).find('.col-order-price').html(toPriceString($(this).find('#field-editQty').val() * getPriceValue($(this).find('.col-unit-price').html())));
                        } else {
                            $(this).find('.col-order-price').html(toPriceString($(this).find('.main-form.qty').val() * getPriceValue($(this).find('.col-unit-price').html())));
                        }
                        $(this).find('.main-form.order-price').val(getPriceValue($(this).find('.col-order-price').html()));
                    } else {
                        $(this).find('.main-form.order-price').val(0);
                    }
                });
            }

            table_orderLines.on('cocoon:after-insert', function(e, insertedItem) {
                if (validateAddProduct() != false) {
                    writeOrderLineItemAttributes(insertedItem);
                    updateProductSelectorItems(insertedItem, 'after-insert');
                    updateTableWithCurrentQty();
                    updateAllPrices();

                    select_products.dropdown('clear');
                    field_newProductQty.val('');
                } else {
                    insertedItem.find('#button-removeItem').click();
                }
            });
            table_orderLines.on('cocoon:after-remove', function(e, removedItem) {
                updateProductSelectorItems(removedItem, 'after-remove');
                updateTableWithCurrentQty();
                updateAllPrices();
            });

        /** SUBTOTAL, DISCOUNT, AND TOTAL */
            function setEnableOfDiscountFields(enabled) {
                if (enabled === false)  {
                    $('.view-form-partial .discount-type-label-container span').addClass('text-label disabled');
                    select_discountType.addClass('disabled');
                    $('.view-form-partial .discount-info-label').addClass('text-label disabled');
                    label_discount.addClass('text-label disabled');
                } else {
                    $('.view-form-partial .discount-type-label-container span').removeClass('text-label disabled');
                    select_discountType.removeClass('disabled');
                    $('.view-form-partial .discount-info-label').removeClass('text-label disabled');
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
                var discount = mainForm_discount.val();
                if (select_discountType.dropdown('get value') === 'percent') {
                    discount = getPriceValue(label_subtotal.html()) * (field_discountPercent.val() / 100);
                } else if (select_discountType.dropdown('get value') === 'amount') {
                    discount = getPriceValue(field_discountAmount.val());
                } else if (select_discountType.dropdown('get value') === 'none') {
                    discount = 0;
                }
                mainForm_discount.val(discount);
                label_discount.html(toPriceString(mainForm_discount.val()));

                if (isNaN(getPriceValue(label_discount.html()))) {
                    label_discount.html('0.00');
                }

                mainForm_discount.val(getPriceValue(label_discount.html()));
            }
            function updateAllPrices() {
                computeOrderPrices();
                computeSubtotal();
                computeDiscount();
                computeTotal();
            }
            select_discountType.dropdown({
                onChange: function() {
                    field_discountPercent.val('');
                    field_discountAmount.val('');
                    label_discount.html('0.00');
                    computeDiscount();
                    computeTotal();
                    if ($(this).dropdown('get value') === 'none') {
                        $('.view-form-partial .discount-value-label-container span').css('display', 'none');
                        container_discountAmount.css('display', 'none');
                        container_discountPercent.css('display', 'none');
                    } else if ($(this).dropdown('get value') === 'percent') {
                        $('.view-form-partial .discount-value-label-container span').css('display', 'block');
                        container_discountAmount.css('display', 'none');
                        container_discountPercent.css('display', 'inline-flex');
                        field_discountPercent.focus();
                    } else if ($(this).dropdown('get value') === 'amount') {
                        $('.view-form-partial .discount-value-label-container span').css('display', 'block');
                        container_discountAmount.css('display', 'inline-flex');
                        container_discountPercent.css('display', 'none');
                        field_discountAmount.focus();
                    }
                    mainForm_discountType.val($(this).dropdown('get value'));
                }
            });
            field_discountPercent.on('input', function() {
                computeDiscount();
                computeTotal();
            });
            field_discountAmount.on('input', function() {
                computeDiscount();
                computeTotal();
            });

        /** STATUS */
            select_status.dropdown({
                onChange: function() {
                    if ($(this).dropdown('get value') == 'unfulfilled') {
                        container_dateFulfilled.css('display', 'none');
                    } else if ($(this).dropdown('get value') == 'fulfilled') {
                        container_dateFulfilled.css('display', 'block');
                    }
                    mainForm_status.val($(this).dropdown('get value'));
                }
            })

        /** LOAD DATA ON EDIT */
            function loadData() {
                var mainFormValuesOnLoad = {
                    purchaseDate: mainForm_purchaseDate.val(),
                    customerAccountID: mainForm_customerAccountID.val(),
                    paymentTerms: mainForm_paymentTerms.val(),
                    dueDate: mainForm_dueDate.val(),
                    subtotal: mainForm_subtotal.val(),
                    discountType: mainForm_discountType.val(),
                    discount: mainForm_discount.val(),
                    negotiatedPrice: mainForm_negotiatedPrice.val(),
                    status: mainForm_status.val(),
                    dateFulfilled: mainForm_dateFulfilled.val()
                }

                /** Customer Accounts Selector */
                if (mainFormValuesOnLoad.customerAccountID !== '') {
                    select_customerAccounts.dropdown('set selected', mainForm_customerAccountID.val());
                }

                /** Purchase Date */
                if (mainFormValuesOnLoad.purchaseDate === '') {
                    mainForm_purchaseDate.val(new Date().formatForDateField());
                }
                computeDueDate();

                /** Payment Terms */
                if (mainFormValuesOnLoad.paymentTerms !== '') {
                    select_paymentTerms.dropdown('set selected', mainForm_paymentTerms.val());
                } else {
                    select_paymentTerms.dropdown('set selected', '30-days');
                }

                /** Order Details */
                table_orderLines.find('.order-line-item').each(function() {
                    writeOrderLineItemAttributes($(this));
                    updateProductSelectorItems($(this), 'after-insert');
                    updateTableWithCurrentQty();
                });
                computeSubtotal();

                /** Discount */
                select_discountType.dropdown('set selected', mainFormValuesOnLoad.discountType);
                if (select_discountType.dropdown('get value') === 'percent') {
                    field_discountPercent.val((mainFormValuesOnLoad.discount / mainFormValuesOnLoad.subtotal) * 100);
                } else if (select_discountType.dropdown('get value') === 'amount') {
                    field_discountAmount.val(mainFormValuesOnLoad.discount);
                } else {
                    mainForm_discountType.val('none');
                    field_discountAmount.val(0);
                }

                /** Compute All Prices */
                updateAllPrices();

                /** Status */
                if (mainFormValuesOnLoad.status !== '') {
                    select_status.dropdown('set selected', mainFormValuesOnLoad.status);
                    if (mainFormValuesOnLoad.status === 'fulfilled') {
                        mainForm_dateFulfilled.val(mainFormValuesOnLoad.dateFulfilled);
                    } else {
                        mainForm_dateFulfilled.val(new Date().formatForDateField());
                    }
                } else {
                    mainForm_status.val('unfulfilled');
                    mainForm_dateFulfilled.val(new Date().formatForDateField());
                }
            }
            loadData();
    }

    script();
}

function view_edit_status() {
    var select_status,
        container_dateFulfilled;
    var mainForm_status,
        mainForm_dateFulfilled;

    function script() {
        select_status = $('.view-edit-status #select-status');
        container_dateFulfilled = $('.view-edit-status .date-fulfilled-container');

        mainForm_status = $('.view-edit-status #purchase_order_status');
        mainForm_dateFulfilled = $('.view-edit-status #purchase_order_date_fulfilled');

        select_status.dropdown({
            onChange: function() {
                mainForm_status.val($(this).dropdown('get value'));
                if ($(this).dropdown('get value') === 'unfulfilled') {
                    container_dateFulfilled.addClass('disabled');
                    mainForm_dateFulfilled.val('');
                    mainForm_dateFulfilled.attr('required', false);
                } else if ($(this).dropdown('get value') === 'fulfilled') {
                    container_dateFulfilled.removeClass('disabled');
                    mainForm_dateFulfilled.val(new Date().formatForDateField());
                    mainForm_dateFulfilled.attr('required', true);
                }
            }
        });

        function loadData() {
            var mainFormValuesOnLoad = {
                status: mainForm_status.val()
            }
            if (mainFormValuesOnLoad.status != '') {
                select_status.dropdown('set selected', mainFormValuesOnLoad.status);
                if (select_status.dropdown('get value') === 'unfulfilled') {
                    container_dateFulfilled.addClass('disabled');
                    mainForm_dateFulfilled.val('');
                    mainForm_dateFulfilled.attr('required', false);
                } else if (select_status.dropdown('get value') === 'fulfilled') {
                    container_dateFulfilled.removeClass('disabled');
                    mainForm_dateFulfilled.attr('required', true);
                }
            }
        }
        loadData();
    }
    script();
}

executeScriptFor('.view-form-partial', view_form_partial);
executeScriptFor('.view-edit-status', view_edit_status);