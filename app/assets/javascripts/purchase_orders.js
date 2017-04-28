var select_customerAccounts, mainForm_customerAccountID;
var select_products;

var observer_config = { childList: true, subtree: true, attributes: true, characterData: true }

$(document).ready(function () {
    /** _FORM.HTML.ERB */
        // Initialize All Dropdowns
        $('.ui.search.dropdown').dropdown();

        /** Customer Selector */
        select_customerAccounts = $('#select-customerAccounts');
        mainForm_customerAccountID = $('#purchase_order_customer_account_id');

        observer_customerAccounts.observe(select_customerAccounts.find('.menu')[0], observer_config);
        select_customerAccounts.dropdown({
            fullTextSearch: true,
            onShow: function() {
                select_customerAccounts.find('.menu .item.selected').removeClass('selected');
                select_customerAccounts.find('.menu .item.active').addClass('selected');
            },
            onHide: function() {
                var selectedCustomer = {
                    'id': select_customerAccounts.find('.menu .item.active').attr('data-value'),
                    'customer_name': select_customerAccounts.find('.menu .item.active .title.text').html(),
                    'address': select_customerAccounts.find('.menu .item.active .details .value.address').html(),
                    'email': select_customerAccounts.find('.menu .item.active .details .value.email').html(),
                    'telephone_number': select_customerAccounts.find('.menu .item.active .details .value.telephone_number').html(),
                    'fax_number': select_customerAccounts.find('.menu .item.active .details .value.fax_number').html(),
                }
                mainForm_customerAccountID.val(selectedCustomer.id);
            }
        });

        /** Product Selector */
        select_products = $('#select-products');
        table_orderLines = $('#table-orderLines');
        observer_products.observe(select_products.find('.menu')[0], observer_config);
        select_products.dropdown({
            onShow: function() {
                select_products.find('.menu .item.selected').removeClass('selected');
                select_products.find('.menu .item.active').addClass('selected');
            },
            onHide: function() {

            },
            onChange: function() {

            }
        });

});

var observer_customerAccounts = new MutationObserver(function () {
    if (select_customerAccounts.find('input').val() === '' && select_customerAccounts.dropdown('get value') !== '') {
        select_customerAccounts.dropdown('set text', select_customerAccounts.find('.menu .item.active .title.text').html());
    }
});
var observer_products = new MutationObserver(function () {
    if (select_products.find('input').val() === '' && select_products.dropdown('get value') !== '') {
        select_products.dropdown('set text', select_products.find('.menu .item.active .title.text').html());
    }
});
