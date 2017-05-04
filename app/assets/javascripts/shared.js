$(document).ready(function() {
    /** Initialize all Semantic-UI Dropdowns */
    $('.ui.dropdown').dropdown();
    $('.ui.dropdown').dropdown({
        onShow: function() {
            /** Make the Active item the selected one on open. 
             * Same block of code executes when dropdown is clicked open,
             * as seen in the .click() function below.
             */
            $(this).find('.menu .item').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        }
    })
    $('.ui.dropdown').find('input').on('input', function() {
        $(this).find('.menu .item').removeClass('selected');
        $(this).find('.menu .item.active').addClass('selected');
    });
    $('.ui.dropdown').click(function() {
        if ($(this).find('.menu .item.active').html() !== undefined) {
            $(this).find('.menu .item').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        }
    });

    /** Prevent Disabled Links/Buttons from being activated through Keyboard Events */
    $('a').on('keydown keyup keypress', function(e) {
        if ($(this).hasClass('disabled')) {
            e.preventDefault();
        }
    });
});

function getLastSegmentOfCurrentPath() {
    return window.location.pathname.toLowerCase().substr(window.location.pathname.lastIndexOf('/') + 1);
}

/** Date Functions */
Date.prototype.addDays = function(days) {
    var result = new Date(this.valueOf());
    result.setDate(result.getDate() + days);
    return result;
}

/** Price Functions */
function toPriceString(num) {
    return parseFloat(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getPriceValue(price) {
    return parseFloat(price.replace(new RegExp(',', 'g'), ''));
}
