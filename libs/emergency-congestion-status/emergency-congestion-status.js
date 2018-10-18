(function(){
  "use strict";

  var gaugeStyle = document.createElement("link");
  gaugeStyle.rel = "stylesheet";
  gaugeStyle.href = "https://cdn.metatavu.io/libs/emergency-congestion-status/emergency-congestion-status.css";
  document.head.appendChild(gaugeStyle);

  var chartJsScript = document.createElement('script');

  chartJsScript.onload = function () {

    var elements =  "<div class=\"chart-container\">" +
      "<canvas class=\"emergency-congestion-status-gauge\"></canvas>" +
    "</div>" +
    "<div class=\"chair-container\">" +
    "  <div class=\"chair-row\">" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "  </div> " +
    "  <div class=\"chair-row\">" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "    <span class=\"chair\"></span>" +
    "  </div>" +
    "</div>" +
    "<div class=\"status-text-container\">" +
    "  <h3 class=\"status-text\"></h3>" +
    "</div>";

    var gaugeScriptElement = document.getElementById("emergency-congestion-status-gauge");
    var gaugeContainerElement = document.createElement("div");
    gaugeContainerElement.setAttribute("id", "emergency-congestion-status-gauge-container");
    gaugeContainerElement.innerHTML = elements;
    gaugeScriptElement.parentNode.insertBefore(gaugeContainerElement, gaugeScriptElement);

    var hideChart = getUrlParameter("hideChart", gaugeScriptElement.src) === "true";
    var hideChairs = getUrlParameter("hideChairs", gaugeScriptElement.src) === "true";
    var hideStatus = getUrlParameter("hideStatus", gaugeScriptElement.src) === "true";
    var chart;
    
    if (hideChart) {
      document.querySelector("#emergency-congestion-status-gauge-container .chart-container").remove();
    }

    if (hideChairs) {
      document.querySelector("#emergency-congestion-status-gauge-container .chair-container").remove();
    }

    if (hideStatus) {
      document.querySelector("#emergency-congestion-status-gauge-container .status-text-container").remove();
    }

    var ctx = document.querySelector("#emergency-congestion-status-gauge-container .emergency-congestion-status-gauge");
    if (!hideChart) {
      chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ["ruuhka", "ruuhka"],
              datasets: [{
                  label: '# of Votes',
                  data: [50, 50],
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                  ]
              }]
          },
          options: {
            legend: {
                display: false
              },
              tooltips: {
                enabled: false
              },
              rotation: 1 * Math.PI,
              maintainAspectRatio: true,
              circumference: 1 * Math.PI
          }
      });
    }

    updateValues(true);

    setInterval(function() {
      updateValues(false);
    }, 5000);

    function updateValues(initialUpdate) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        var DONE = 4; 
        var OK = 200;
        if (xhr.readyState == DONE) {
          var status = JSON.parse(xhr.responseText);
          var value = parseInt(status[0].value);
          updateChart(value);
          updateChairs(value);
          updateStatusText(value);
          if (initialUpdate && !hideChairs) {
            fitText(document.querySelectorAll("#emergency-congestion-status-gauge-container .chair-row"));
          }
        }
      };
      xhr.open('GET', 'https://essote-soteapi.metatavu.io/v1/emergencyCongestionStatuses?firstResult=0&maxResults=1');
      xhr.send(null);
    }

    function updateChart(value) {
      if (hideChart) {
        return;
      }

      chart.data.datasets[0].data[0] = value;
      chart.data.datasets[0].data[1] = 100 - value;
      chart.data.datasets[0].backgroundColor = getColor(value);
      chart.update();
    }

    function updateChairs(value) {
      if (hideChairs) {
        return;
      }

      var color = getColor(value)[0];
      var chairs = document.querySelectorAll("#emergency-congestion-status-gauge-container .chair");
      var divider = 100 / chairs.length;
      var occupied = Math.floor(value / divider);
      for(var i = 0; i < chairs.length; i++) {
        chairs[i].style.color = color;

        if (i <= occupied) {
          removeClass(chairs[i], "emergency-congestion-status-icon-chair_empty");
          addClass(chairs[i], "emergency-congestion-status-icon-chair_full");
        } else {
          removeClass(chairs[i], "emergency-congestion-status-icon-chair_full");
          addClass(chairs[i], "emergency-congestion-status-icon-chair_empty");
        }
      }
    }

    function updateStatusText(value) {
      if (hideStatus) {
        return;
      }

      const statusTextElement = document.querySelector("#emergency-congestion-status-gauge-container .status-text");
      if (value <= 32) {
        statusTextElement.innerHTML = "Odotusaika ei ole pitkä."
      } else if (value >= 33 && value <= 65) {
        statusTextElement.innerHTML = "Odotusajat ovat hieman pidentyneet."
      } else if (value >= 66) {
        statusTextElement.innerHTML = "Odotusaika on pidentynyt."
      }
    }

    function getUrlParameter(nameParam, queryString) {
      var name = nameParam.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(queryString);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    function removeClass(element, classToRemove) {
      var classes = element.className.split(" ");
      var index = classes.indexOf(classToRemove);
      if (index > -1) {
        classes.splice(index, 1);
      }
      element.className = classes.join(" ");
    }

    function addClass(element, classToAdd) {
      var classes = element.className.split(" ");
      var index = classes.indexOf(classToAdd);
      if (index < 0) {
        classes.push(classToAdd);
      }
      element.className = classes.join(" ");
    }

    function getColor(value) {
      var color = '';
      if (value <= 32) {
        color = 'green';
      }
      else if (value >= 33 && value <= 65) {
        color = '#d8cf1a';
      }
      else if (value >= 66) {
        color = 'red';
      }
      return [color];
    }

    function fitText(el, kompressor, options) {

      var settings = extend({
        'minFontSize' : -1/0,
        'maxFontSize' : 1/0
      }, options);

      var fit = function (el) {
        var compressor = kompressor || 1;
        var resizer = function () {
          el.style.fontSize = Math.max(Math.min(el.clientWidth / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
        };
        resizer();
        addEvent(window, 'resize', resizer);
        addEvent(window, 'orientationchange', resizer);
      };

      if (el.length) {
        for(var i=0; i<el.length; i++) {
          fit(el[i]);
        }
      } else {
        fit(el);
      }

      return el;
    };

    function addEvent(el, type, fn) {
      if (el.addEventListener) {
        el.addEventListener(type, fn, false);
      } else {
        el.attachEvent('on'+type, fn);
      }
    };
      
    function extend(obj, ext) {
      for(var key in ext) {
        if(ext.hasOwnProperty(key)) {
          obj[key] = ext[key];
        }
      }
      return obj;
    };
  };

  chartJsScript.src = "https://cdn.metatavu.io/libs/chart-js/2.7.2/Chart.min.js";
  document.head.appendChild(chartJsScript);

})();