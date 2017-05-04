var select_customerAccounts, mainForm_customerAccountID;
var select_products, text_newProductQty, button_addOrderLine,
    container_normalMode, button_deleteMode, button_editMode,
    container_editMode, button_saveEdit, button_cancelEdit,
    container_deleteMode, button_deleteSelected, button_cancelDelete, 
    table_orderLines,
    container_discountPercent, container_discountAmount,
    select_discountType, text_discountPercent, text_discountAmount, mainForm_discountAmount,
    info_subtotal, info_discount, info_total;

var observerConfig = { childList: true, subtree: true, attributes: true, characterData: true };

$(document).ready(function () {
    /** _FORM.HTML.ERB */
    // Initialize all dropdowns
    $('.ui.dropdown').dropdown();

    /** Customer Selector */
    select_customerAccounts = $('#select-customerAccounts');
    mainForm_customerAccountID = $('#purchase_order_customer_account_id');

    // Add MutationObserver to select_customerAccounts
    /** MutationObserver is used to detect changes in the dropdown. Once a change is detected, 
     * the dropdown text is adjusted to show only the title text. Applies to select_products as well.
     */
    observer_customerAccounts.observe(select_customerAccounts.find('.menu')[0], observerConfig);
    select_customerAccounts.dropdown({
        fullTextSearch: true,
        forceSelection: false,
        onShow: function() {
            $(this).find('.menu .item.selected').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        },
        onHide: function() {
            mainForm_customerAccountID.val($(this).dropdown('get value'));
        }
    });
    select_customerAccounts.click(function() {
        if ($(this).find('.menu .item.active').html() !== undefined) {
            $(this).find('.menu .item.selected').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        }
    });

    /** Order Details */
    select_products = $('#select-products');
    button_addOrderLine = $('#button-addOrderLine');
    text_newProductQty = $('#text-newProductQty');

    // Action Buttons
    container_normalMode = $('.normal-mode-buttons');
    button_deleteMode = $('#button-deleteMode');
    button_editMode = $('#button-editMode');
    container_editMode = $('.edit-mode-buttons');
    button_saveEdit = $('#button-editMode-save');
    button_cancelEdit = $('#button-editMode-cancel');
    container_deleteMode = $('.delete-mode-buttons');
    button_deleteSelected = $('#button-deleteMode-delete');
    button_cancelDelete = $('#button-deleteMode-cancel');
    check_selectAll = $('#check-selectAll');

    // Table
    label_itemsAddedCount = $('#label-itemsAddedCount');
    table_orderLines = $('#table-orderLines');

    // Discount
    select_discountType = $('#select-discountType');
    container_discountPercent = $('.text-discount-percent-container');
    text_discountPercent = $('#text-discountPercent');
    container_discountAmount = $('.text-discount-amount-container');
    text_discountAmount = $('#text-discountAmount');
    mainForm_discountAmount = $('#purchase_order_discount');
    
    // Prices
    info_subtotal = $('#info-subtotal');
    info_discount = $('#info-discount');
    info_total = $('#info-total');


    // Attach MutationOberver to Product Selector
    observer_products.observe(select_products.find('.menu')[0], observerConfig);
    
    // Setup Product Selector Dropdown
    select_products.dropdown({
        fullTextSearch: true,
        forceSelection: false,
        onShow: function() {
            $(this).find('.menu .item.selected').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        },
        onHide: function() {
            text_newProductQty.focus();
            text_newProductQty.select();
            enableDisableAddOrderLine();
        },
    });
    select_products.click(function() {
        if ($(this).find('.menu .item.active').html() !== undefined) {
            $(this).find('.menu .item.selected').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        }
    });

    text_newProductQty.on('input keyup paste', function() {
        enableDisableAddOrderLine();
    });

    function enableDisableAddOrderLine() {
        if (select_products.dropdown('get value') === '' || text_newProductQty.val() === '') {
            button_addOrderLine.addClass('disabled');
        } else {
            button_addOrderLine.removeClass('disabled');
        }
    }

    /** Attach MutationObserver to Order Line Table */
    /** The MutationObserver detects changes in the orderLineTable. If a change is
     * detected, the appropriate values are assigned to the hidden fields that correspond
     * to the attributes of the OrderLine model.
     */
    observer_orderLineTable.observe(table_orderLines.find('tbody')[0], {childList: true, attributes: true, characterData: true });

    // Edit & Delete Mode Functions
    function enterEditMode() {
         var inputHTML = '<input id="text-editQty" type="number" min="1" value="1">';

        container_normalMode.css('display', 'none');
        container_editMode.css('display', 'block');
        enableDisableProductSelectorFields('disable');

        $('.item-count-container').html('<b>Edit:</b> Use the textbox on each row to edit the quantity of an item.');

        // Set default value to current quantity.
        table_orderLines.find('tbody .order-line-item').each(function() {
            $(this).find('.col-qty').html(inputHTML);
            $(this).find('#text-editQty').val($(this).find('.main-form.qty').val());
        });

        // Attach 'on change' event to each Edit Qty. field
        $('#text-editQty').on('input keyup paste', function() {
            var orderLineItem = $('#text-editQty').parent().parent();
            orderLineItem.find('.col-order-price').html(
                displayPrice(
                    orderLineItem.find('#text-editQty').val() * parsePrice(orderLineItem.find('.col-unit-price').html())
                )
            );
        });
    }
    function exitEditMode(save) {
        table_orderLines.find('tbody .order-line-item').each(function() {
            if (save === true) {
                $(this).find('.main-form.qty').val($(this).find('#text-editQty').val());
            }   
            $(this).find('.col-qty').html($(this).find('.main-form.qty').val());
        });
        container_normalMode.css('display', 'block');
        container_editMode.css('display', 'none');
        enableDisableProductSelectorFields('enable');
        updateOrderLineItemsInfo();
        computeSubtotalAndTotal();
    }
    function enterDeleteMode() {
        container_normalMode.css('display', 'none');
        container_deleteMode.css('display', 'block');
        table_orderLines.find('.col-checkbox').css('display', 'table-cell');
        table_orderLines.find('.col-particulars').css('border-left-width', '1px');
        enableDisableProductSelectorFields('disable');

        $('.item-count-container').html('<b>Delete:</b> Select the items you want to delete.');
        button_deleteSelected.addClass('disabled');
        button_deleteSelected.find('.selected-count').html('');

        // Uncheck all checkboxes
        check_selectAll.checkbox('set unchecked');
        table_orderLines.find('tbody .order-line-item').each(function() {
            table_orderLines.find('tbody .order-line-item').each(function() {
                $(this).find('.col-checkbox #check-itemSelect').checkbox('set unchecked');
            });
        });

        // Configure check events of all Item Checkboxes
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
        enableDisableProductSelectorFields('enable');
    }

    // Product Selector & Order Line Table Functions
    function enableDisableProductSelectorFields(val) {
        if (val.toLowerCase() === 'disable') {
            select_products.addClass('disabled');
            $('.select-qty-label').addClass('text-label disabled');
            // Targets parent() due to Semantic-UI Structure
            text_newProductQty.parent().addClass('disabled');
            button_addOrderLine.addClass('disabled');
        } else if (val.toLowerCase() === 'enable') {
            select_products.removeClass('disabled');
            $('.select-qty-label').removeClass('text-label disabled');
            text_newProductQty.parent().removeClass('disabled');
            button_addOrderLine.removeClass('disabled');
            enableDisableAddOrderLine();
        }
    }
    function insertOrderLineAttributes(orderLineItem) {
        var mainForm_orderLineProductID = orderLineItem.find('.main-form.product-id');
        var mainForm_orderLineQty = orderLineItem.find('.main-form.qty');
            
        if (mainForm_orderLineProductID.val() === '') {
            mainForm_orderLineProductID.val(select_products.dropdown('get value'));
        }
        if (mainForm_orderLineQty.val() === '') {  
            mainForm_orderLineQty.val(text_newProductQty.val());
        }
    }
    function updateProductSelector() {
        // Reset items in Product Selector
        select_products.find('.menu.custom .item').each(function() {
            $(this).css('display', 'block');
        });
        
        // Remove items that are already added from Products selector
        table_orderLines.find('tbody .order-line-item').each(function() {
            var productID = $(this).find('.main-form.product-id').val();
            select_products.find('.menu.custom .item').each(function() {
                if ($(this).data('value') == productID) {
                    $(this).css('display', 'none');
                }
            });
        });
        select_products.dropdown('clear');
        text_newProductQty.val(text_newProductQty.attr('value'));
        enableDisableAddOrderLine();
    }
    function updateOrderLineItemsInfo() {
        // Update item Count
        var itemCount = 0;
        table_orderLines.find('tbody .order-line-item').each(function() { itemCount += 1; });

        if (itemCount > 0) {
            button_deleteMode.removeClass('disabled');
            button_editMode.removeClass('disabled');
            table_orderLines.css('border-bottom-width', '1px');

            // Enable Discount
            $('.discount-type-label-container span').removeClass('text-label disabled');
            select_discountType.removeClass('disabled');
            $('.discount-info-label').removeClass('text-label disabled');
            info_discount.removeClass('text-label disabled');
        } else {
            button_deleteMode.addClass('disabled');
            button_editMode.addClass('disabled');
            table_orderLines.css('border-bottom-width', '0');

            // Disable Discount
            $('.discount-type-label-container span').addClass('text-label disabled');
            select_discountType.addClass('disabled');
            $('.discount-info-label').addClass('text-label disabled');
            info_discount.addClass('text-label disabled');
        }
        if (itemCount === 0) {
            $('.item-count-container').html('Select a product to add from the dropdown.');
        } else if (itemCount === 1) {
            $('.item-count-container').html(itemCount + ' item added.');
        } else {
            $('.item-count-container').html(itemCount + ' items added.');
        }

        // Update Order Price of each row
        table_orderLines.find('tbody .order-line-item').each(function() {
            $(this).find('.col-order-price').html(displayPrice($(this).find('.main-form.qty').val() * parsePrice($(this).find('.col-unit-price').html())));
        });
    }



    // HTML Elements Event Handlers
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
    table_orderLines.on('cocoon:after-insert', function(e, insertedItem) {
        insertOrderLineAttributes(insertedItem);
        updateProductSelector();
        updateOrderLineItemsInfo();
        computeSubtotalAndTotal();
    });
    table_orderLines.on('cocoon:after-remove', function(e, removedItem) {
        updateProductSelector();
        updateOrderLineItemsInfo();
        computeSubtotalAndTotal();
    });
    updateProductSelector();
    updateOrderLineItemsInfo();

    // Discount & Prices
    function computeDiscount() {
        var discount = 0;
        if (select_discountType.dropdown('get value') === 'percent') {
            discount = parsePrice(info_subtotal.html()) * (text_discountPercent.val() / 100);
        } else if (select_discountType.dropdown('get value') === 'amount') {
            discount = text_discountAmount.val();
        }
        mainForm_discountAmount.val(discount);
        info_discount.html(displayPrice(mainForm_discountAmount.val()));

        if (isNaN(parsePrice(info_discount.html()))) {
            info_discount.html('0.00');
        }
    }       
    function computeSubtotalAndTotal() {
        var subtotal = 0;
        table_orderLines.find('tbody .order-line-item').each(function() {
            subtotal += parsePrice($(this).find('.col-order-price').html());
        });
        info_subtotal.html(displayPrice(subtotal));
        info_total.html(displayPrice(subtotal - parsePrice(info_discount.html())));
    }
    select_discountType.dropdown({
        onChange: function() {
            text_discountPercent.val('');
            text_discountAmount.val('');
            info_discount.html('0.00');
            if ($(this).dropdown('get value') === 'none') {
                $('.discount-value-label-container span').css('display', 'none');
                container_discountAmount.css('display', 'none');
                container_discountPercent.css('display', 'none');
            } else if ($(this).dropdown('get value') === 'percent') {
                $('.discount-value-label-container span').css('display', 'block');
                container_discountAmount.css('display', 'none');
                container_discountPercent.css('display', 'inline-flex');
                text_discountPercent.focus();
            } else if ($(this).dropdown('get value') === 'amount') {
                $('.discount-value-label-container span').css('display', 'block');
                container_discountAmount.css('display', 'inline-flex');
                container_discountPercent.css('display', 'none');
                text_discountAmount.focus();
            } 
        }
    });
    text_discountPercent.on('input', function() {
        computeDiscount();
    });
    text_discountAmount.on('input', function() {
        computeDiscount();
    });

});

// MutationObserver Events
var observer_customerAccounts = new MutationObserver(function () {
    if (select_customerAccounts.find('input').val() === '' && select_customerAccounts.dropdown('get value') !== '') {
        select_customerAccounts.dropdown('set text', select_customerAccounts.find('.menu .item.active .title.text').html());
    }
});
var observer_products = new MutationObserver(function () {
    if (select_products.find('input').val() === '' && select_products.dropdown('get value') !== '') {
        select_products.dropdown('set text', select_products.find('.menu .item.active .title.text').html() + ' (' + select_products.find('.menu .item.active .value.specs').html() + ')');
    }
});
var observer_orderLineTable = new MutationObserver(function (mutations) {
    table_orderLines.find('tbody .order-line-item').each(function() {
        // var orderLineItem = $(this);

        // var mainForm_orderLineProductID = orderLineItem.find('.main-form.product-id');
        // var mainForm_orderLineQty = orderLineItem.find('.main-form.qty');

        // var currentProductID = mainForm_orderLineProductID.val();
        
        // var orderLineTable_colParticulars = orderLineItem.find('.col-particulars');
        // var orderLineTable_colUnitPrice = orderLineItem.find('.col-unit-price');
        // var orderLineTable_colQty = orderLineItem.find('.col-qty');
        // var orderLineTable_colOrderPrice = orderLineItem.find('.col-order-price');

        // $.getJSON('../api/db?table=products&q=' + currentProductID, function(data) {
        //     orderLineTable_colParticulars.html(data.product_name + ' (' + data.product_specs + ')');            
        //     orderLineTable_colUnitPrice.html(displayPrice(data.unit_price));
        //     orderLineTable_colQty.html(mainForm_orderLineQty.val());
        //     orderLineTable_colOrderPrice.html(displayPrice(mainForm_orderLineQty.val() * data.unit_price));

        //     /** Compute Subtotal & Total Upon Insertion. Function computeSubtotalAndTotal()
        //     * in $(document).ready() cannot be used since information about OrderLine
        //     * arrives right after insertion.
        //     */
        //     subtotal += parsePrice(orderLineItem.find('.col-order-price').html());
        //     info_subtotal.html(displayPrice(subtotal));
        //     info_total.html(displayPrice(subtotal - parsePrice(info_discount.html())));
        // });

        var orderLineItem = $(this);
        var mainForm_orderLineProductID = orderLineItem.find('.main-form.product-id');
        var mainForm_orderLineQty = orderLineItem.find('.main-form.qty');
        var productData = {};

        select_products.find('.menu .item').each(function() {
            if ($(this).data('value') == mainForm_orderLineProductID.val()) {
                productData.productName = $(this).find('#val-productName').html();
                productData.productSpecs = $(this).find('#val-productSpecs').html();
                productData.unitPrice = $(this).find('#val-unitPrice').html();
            }
        });

        orderLineItem.find('.col-particulars').html(productData.productName + ' (' + productData.productSpecs + ')');
        orderLineItem.find('.col-unit-price').html(productData.unitPrice)
        orderLineItem.find('.col-qty').html(mainForm_orderLineQty.val());
        orderLineItem.find('.col-order-price').html(displayPrice(mainForm_orderLineQty.val() * productData.unitPrice));
    });


});