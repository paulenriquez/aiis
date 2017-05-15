function view_form_partial() {
    var select_customerAccounts;
    var table_poTable, label_poStatus;

    var mainForm_customerAccountID,
        mainForm_purchaseOrderID,
        mainForm_paymentDate,
        mainForm_amountPaid;

    var apiPath = '../api/po_for_payment';

    function script() {
        select_customerAccounts = $('.view-form-partial #select-customerAccounts');
        table_poTable = $('.view-form-partial #table-poTable');
        label_poStatus = $('.view-form-partial #label-poStatus');

        mainForm_customerAccountID = $('.view-form-partial #customer_payment_customer_account_id');
        mainForm_purchaseOrderID = $('.view-form-partial #customer_payment_purchase_order_id');
        mainForm_paymentDate = $('.view-form-partial #customer_payment_payment_date');
        mainForm_amountPaid = $('.view-form-partial #customer_payment_amount_paid');

        function changeTableState(state) {
            label_poStatus.html('No Purchase Order selected.');
            if (state.toLowerCase() === 'no-customer') {
                table_poTable.find('thead').css('display', 'none');
                table_poTable.find('tbody').html('<tr class = "tr-message"><td colsplan = "5"><i>Select a Customer from the dropdown above.</i></td></tr>');
            } else if (state.toLowerCase() === 'loading') {
                table_poTable.find('thead').css('display', 'none');
                table_poTable.find('tbody').html('<tr class = "tr-message"><td colsplan = "5"><div class = "ui tiny inline active loader"></div>&nbsp;&nbsp;&nbsp;<i>Loading...</i></td></td></tr>');
            } else if (state.toLowerCase() === 'no-po') {
                table_poTable.find('thead').css('display', 'none');
                table_poTable.find('tbody').html('<tr class = "tr-message"><td colsplan = "5"><i>This customer does not have any Purchase Order with an Outstanding Balance.</i></td></tr>');
            } else if (state.toLowerCase() === 'display-po') {
                table_poTable.find('thead').css('display', 'table-header-group');
                table_poTable.find('tbody').html('');
            }
        }
        changeTableState('no-customer');

        function retrievePurchaseOrders(customeAccountID) {
            changeTableState('loading');
            mainForm_purchaseOrderID.val('');
            if (mainForm_customerAccountID != '') {
                $.getJSON(apiPath + '?customer_account_id=' + customeAccountID, function(data) {
                    if (data.length > 0) {
                        changeTableState('display-po');
                        for(var i = 0; i < data.length; i++) {
                            /** Build Table Rows */
                            var tableRow = '';
                            tableRow += '<tr data-value = ' + data[i].id + '>';
                            tableRow += '<td class = "col-select"><div id = "check-po' + data[i].id + '" class = "ui fitted radio checkbox"><input type = "radio" data-value = ' +  data[i].id + '></div></td>';
                            tableRow += '<td class = "col-poNum">' + data[i].po_num + '</td>';
                            tableRow += '<td class = "col-purchaseDate">' + new Date(data[i].purchase_date).formatHumanReadable() + '</td>';
                            tableRow += '<td class = "col-total">' + toPriceString(data[i].negotiated_price) + '</td>';
                            tableRow += '<td class = "col-outstanding">' + toPriceString(data[i].outstanding_balance) + '</td>';
                            tableRow += '</tr>';
                            table_poTable.find('tbody').append(tableRow);

                            /** Bind Event handlers to Radio Buttons */
                            $('#check-po' + data[i].id).checkbox({
                                onChecked: function() {
                                    mainForm_purchaseOrderID.val($(this).data('value'));

                                    label_poStatus.html('<b>' + $(this).parent().parent().parent().find('.col-poNum').html() + '</b> selected.');

                                    /** Uncheck other Radio Buttons */
                                    table_poTable.find('tbody .ui.radio.checkbox').each(function() {
                                        if ($(this).find('input').data('value') != mainForm_purchaseOrderID.val()) {
                                            $(this).checkbox('uncheck');
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        changeTableState('no-po');
                    }
                });
            } else {
                changeTableState('no-customer');
            }
        }
        select_customerAccounts.dropdown('setting', 'onHide', function() {
            retrievePurchaseOrders($(this).dropdown('get value'));
            mainForm_customerAccountID.val($(this).dropdown('get value'));
        });

        function loadData() {
            var mainFormValuesOnLoad = {
                customerAccountID: mainForm_customerAccountID.val(),
                purchaseOrderID: mainForm_purchaseOrderID.val(),
                paymentDate: mainForm_paymentDate.val(),
                amountPaid: mainForm_amountPaid.val()
            }

            if (mainFormValuesOnLoad.customerAccountID != '') {
                select_customerAccounts.dropdown('set selected', mainFormValuesOnLoad.customerAccountID);
            }

            if (mainFormValuesOnLoad.purchaseOrderID === '') {
                if (mainFormValuesOnLoad.customerAccountID != '') {
                    retrievePurchaseOrders(mainFormValuesOnLoad.customerAccountID);
                }
            }

            if (mainFormValuesOnLoad.paymentDate == '') {
                mainForm_paymentDate.val(new Date().formatForDateField());
            }
        }
        loadData();
    }

    script();
}

executeScriptFor('.view-form-partial', view_form_partial);