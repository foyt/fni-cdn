$(document).on('metaformReady', function() {
  $('#field-phone-number').attr('placeholder', 'Syötä puhelinnumero');
  $('.form-control').addClass('pristine');
  $('.form-control').focus(function(){
    $(this).removeClass('pristine');
  });
  $('.form-control').change(function(){
    $(this).removeClass('pristine');
  });
  $(document).on('click', '.flatpickr-input', function(){
    $(this).removeClass('pristine');
  });
});
