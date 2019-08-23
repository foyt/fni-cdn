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
  preferredContactDatePicker.set("disable", [new Date(2019, 0, 1), new Date(2019,0,6), new Date(2019,3,19), new Date(2019,3,21), new Date(2019,3,22), new Date(2019,3,30), new Date(2019,4,1), new Date(2019,4,30), new Date(2019,5,9), new Date(2019,5,21), new Date(2019,5,22), new Date(2019,10,2), new Date(2019,11,6), new Date(2019,11,24), new Date(2019,11,25), new Date(2019,11,26), new Date(2019,11,31) ]);
});
