function view_form_partial() {
    var select_products;
    var select_actionType;

    var mainForm_productID,
        mainForm_dateChanged,
        mainForm_actionType;

    function script() {
        select_products = $('.view-form-partial #select-products');
        select_actionType = $('.view-form-partial #select-actionType');

        mainForm_productID = $('.view-form-partial #inventory_history_product_id');
        mainForm_dateChanged = $('.view-form-partial #inventory_history_date_changed');

        mainForm_actionType = $('.view-form-partial #inventory_history_action_type');

        select_products.dropdown('setting', 'onHide', function() {
            mainForm_productID.val($(this).dropdown('get value'));
        });

        select_actionType.dropdown({
            onChange: function() {
                mainForm_actionType.val($(this).dropdown('get value'))
            }
        })        

        function loadData() {
            mainFormValuesOnLoad = {
                productID: mainForm_productID.val(),
                dateChanged: mainForm_dateChanged.val(),
                actionType: mainForm_actionType.val()
            }

            /** Product Selector */
            if (mainFormValuesOnLoad.productID !== '') {
                select_products.dropdown('set selected', mainForm_productID.val());
            }

            /** Date Changed */
            if (mainFormValuesOnLoad.dateChanged === '') {
                mainForm_dateChanged.val(new Date().formatForDateField());
            }

            /** Action Type */
            if (mainFormValuesOnLoad.actionType !== '') {
                select_actionType.dropdown('set selected', mainForm_actionType.val());
            } else {
                mainForm_actionType.val('in');
            }
        }
        loadData();
    }

    script();
}

executeScriptFor('.view-form-partial', view_form_partial);