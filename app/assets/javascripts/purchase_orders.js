// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function () {
    /** _FORM.HTML.ERB */
    /** Customer Accounts */
        var customerAccounts_searchText = $('#text-customerAccounts-search');
        var customerAccounts_criteriaSelector = $('#select-customerAccounts-searchCriteria');
        var customerAccounts_container = $('#container-customerAccounts-search');
        var mainForm_customerAccountID = $('#purchase_order_customer_account_id');

        function customerAccounts_getSearchQuery() { return customerAccounts_searchText.val(); }
        function customerAccounts_getSearchCriteria() { return customerAccounts_criteriaSelector.dropdown('get value'); }
        
        function customerAccounts_doSearch(criteria, query) {
            customerAccounts_container.search({
                apiSettings: {
                    url: '../api/db/search?table=customer_accounts&by=' + criteria + '&q=' + query
                },
                type: 'customerAccountsTemplate',
                templates: {
                    customerAccountsTemplate: function (response, fields) {
                        var html = '';
                        $.each (response[fields.results], function (index, result) {
                            html += '<a class="result" value="' + result[fields.id] + '">';
                            html += '<div class="content">';
                            html += '<div class="title">' + result[fields.title] + '</div>';
                            html += '<div class="description">' + result[fields.address]  + '</div>';
                            html += '<div class="description">' + result[fields.email] + '</div>';
                            html += '</div>';
                            html += '</a>';
                        });
                        return html;
                    }
                },
                fields: {
                    results: 'items',
                    id: 'id',
                    title: 'customer_name',
                    address : 'address',
                    email: 'email',
                    telephone_number: 'telephone_number',
                    fax_number: 'fax_number'
                },
                minimumCharacters: 0,
                onSelect: function(result, response) {
                    customerAccounts_setSelectedItem(result);
                }
            });
        }
        function customerAccounts_setSelectedItem(item) {
            mainForm_customerAccountID.val(item.id);
        }
        customerAccounts_searchText.keyup(function() {
            customerAccounts_doSearch(customerAccounts_getSearchCriteria(), customerAccounts_getSearchQuery());
        });

        // Search Criteria Selector
        customerAccounts_criteriaSelector.dropdown('set value', 'customer_name');
        customerAccounts_criteriaSelector.dropdown({
            selectOnKeydown: false,
            onChange: function(value, text) {
                customerAccounts_criteriaSelector.dropdown('set text', 'Search By ' + text);
                customerAccounts_searchText.focus();
            }
        });
        customerAccounts_criteriaSelector.dropdown('set text', 'Search By Name');
        
    /** Product Selector */
});