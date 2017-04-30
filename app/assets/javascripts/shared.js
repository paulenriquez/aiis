$(document).ready(function() {
    $('a').on('keydown keyup keypress', function(e) {
        if ($(this).hasClass('disabled')) {
            e.preventDefault();
        }
    });
    
});
function displayPrice(num) {
    return parseFloat(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function parsePrice(price) {
    return parseFloat(price.replace(new RegExp(',', 'g'), ''));
}