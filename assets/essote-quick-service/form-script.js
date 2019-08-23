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

  var preferredContactDatePicker = document.querySelector("#field-prefered-contact-date")._flatpickr;
  preferredContactDatePicker.set("disable", [new Date(2019, 1, 1), new Date(2019,1,6), new Date(2019,4,19), new Date(2019,4,21), new Date(2019,4,22), new Date(2019,4,30), new Date(2019,5,1), new Date(2019,5,30), new Date(2019,6,9), new Date(2019,6,21), new Date(2019,6,22), new Date(2019,11,2), new Date(2019,12,6), new Date(2019,12,24), new Date(2019,12,25), new Date(2019,12,26), new Date(2019,12,31) ]);
});
