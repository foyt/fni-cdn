/* jshint esversion: 6 */
/* global window, document, moment, $, _*/
(function() {
  'use strict';
  
  $.widget("custom.metaformBirthdayPicker", {
    
    options: {
      locale: 'fi',
      order: ['DAY', 'MONTH', 'YEAR'],
      inputClass: 'form-control',
      inputContainerClass: 'form-inline',
      labels: {
        DAY: 'Päivä',
        MONTH: 'Kuukausi',
        YEAR: 'Vuosi'
      },
      maxAge: 150
    },
    
    val: function(value) {
      if (value) {
        var newValue = moment(value);
        if (!newValue.isValid()) {
          console.error("Cannot set invalid date value" + value);
          return;
        }
        this._setDayValue(newValue.date());
        this._setMonthValue(newValue.month());
        this._setYearValue(newValue.year());
      } else {
        var birthday = moment({ 
          year: this._getYearValue(),
          month: this._getMonthValue(),
          day: this._getDayValue()
        });

        if (birthday.isValid()) {
          return birthday.toDate();
        } 

        return null; 
      }
    },
    
    _create: function() {
      this.element.hide();
      this.required = this.element.attr('required') ? true : false;
      this.container = $('<div>').addClass(this.options.inputContainerClass);
      for (var i = 0; i < this.options.order.length; i++) {
        switch (this.options.order[i]) {
          case 'DAY':
            this.container.append(this._createDayInput());
          break;
          case 'MONTH':
            this.container.append(this._createMonthInput());
          break;
          case 'YEAR':
            this.container.append(this._createYearInput());
          break;
          default:
            console.error("Unknown birthday input type " + this.options.order[i]); 
          break;
        }
      }

      this.element.after(this.container);
    },

    _getDayValue: function() {
      return this.container.find('.metaform-birtday-day-input').val();
    },
    
    _getMonthValue: function() {
      return this.container.find('.metaform-birtday-month-input').val();
    },
    
    _getYearValue: function() {
      return this.container.find('.metaform-birtday-year-input').val();
    },
    
    _setDayValue: function(value) {
      return this.container.find('.metaform-birtday-day-input').val(value);
    },
    
    _setMonthValue: function(value) {
      return this.container.find('.metaform-birtday-month-input').val(value);
    },
    
    _setYearValue: function(value) {
      return this.container.find('.metaform-birtday-year-input').val(value);
    },
    
    _updateDisabledDates: function(daysInMonth) {
      var dayInput = this.container.find('.metaform-birtday-day-input');
      dayInput.find('option').each(function() {
        if(!$(this).val() || $(this).val() > daysInMonth) {
          $(this).attr('disabled', 'disabled');
        } else {
          $(this).removeAttr('disabled');
        }
      });
    },
    
    _createDayInput: function() {
      var daySelect = $('<select>')
        .addClass('metaform-birtday-day-input')
        .addClass(this.options.inputClass);
      
      if (this.required) {
        daySelect.attr('required', 'required');
      }
      
      daySelect.append($('<option>').attr('selected', 'selected').attr('value', '').attr('disabled', 'disabled').text(this.options.labels['DAY']));
      
      for(var i = 1; i <= 31; i++) {
        daySelect.append(
          $('<option>')
            .attr('value', i)
            .text(i));
      }
      daySelect.change(this._onInputComponentChange.bind(this));
      return daySelect;
    },
    
    _createMonthInput: function() {
      var localeData = moment.localeData(this.options.locale);
      var monthNames = localeData.months();
      var monthSelect = $('<select>')
        .addClass('metaform-birtday-month-input')
        .addClass(this.options.inputClass);

      if (this.required) {
        monthSelect.attr('required', 'required');
      }

      monthSelect.append($('<option>').attr('selected', 'selected').attr('value', '').attr('disabled', 'disabled').text(this.options.labels['MONTH']));
      
      for(var i = 0; i < monthNames.length; i++) {
        monthSelect.append(
          $('<option>')
            .attr('value', i)
            .text(monthNames[i]));
      }
      
      monthSelect.change(this._onYearOrMonthInputChange.bind(this));
      monthSelect.change(this._onInputComponentChange.bind(this));
      return monthSelect;
    },
    
    _createYearInput: function() {
      var currentYear = (new Date()).getFullYear();
      var yearSelect = $('<select>')
        .addClass('metaform-birtday-year-input')
        .addClass(this.options.inputClass);

      if (this.required) {
        yearSelect.attr('required', 'required');
      }

      yearSelect.append($('<option>').attr('selected', 'selected').attr('value', '').attr('disabled', 'disabled').text(this.options.labels['YEAR']));
      
      for(var i = currentYear; i > (currentYear - this.options.maxAge); i--) {
        yearSelect.append(
          $('<option>')
            .attr('value', i)
            .text(i));
      }
      
      yearSelect.change(this._onYearOrMonthInputChange.bind(this));
      yearSelect.change(this._onInputComponentChange.bind(this));
      return yearSelect;
    },
    
    _updateInputValidity: function(validity) {
      var customValidity = validity || "";
      this.container.find('.metaform-birtday-day-input')[0].setCustomValidity(customValidity);
      this.container.find('.metaform-birtday-month-input')[0].setCustomValidity(customValidity);
      this.container.find('.metaform-birtday-year-input')[0].setCustomValidity(customValidity);
    },
    
    _onYearOrMonthInputChange: function(e) {
      var currentDayValue = this._getDayValue();
      var currentMonthValue = this._getMonthValue();
      var currentYearValue = this._getYearValue() || (new Date()).getFullYear();
      
      if (currentMonthValue) {
        var daysInMonth = moment({ year: currentYearValue, month: currentMonthValue}).daysInMonth();
        if (currentDayValue > daysInMonth) {
          this._setDayValue("");
        }
        this._updateDisabledDates(daysInMonth);
      }
    },
    
    _onInputComponentChange: function(e) {
      var birthday = moment({ 
        year: this._getYearValue(),
        month: this._getMonthValue(),
        day: this._getDayValue()
      });
      
      var validity = "Invalid birthday";
      if (birthday.isValid()) {
        this.element.val(birthday.toDate());
        validity = "";
      }
      
      this._updateInputValidity(validity);
      this.element.trigger('change');
    }
  });
})();