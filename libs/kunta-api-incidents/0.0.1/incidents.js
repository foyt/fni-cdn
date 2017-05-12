(function () {
  'use strict';
  
  var interval;
  
  function addListener(object, eventName, func) {
    if (object.addEventListener) {
      object.addEventListener(eventName, func, false);
    } else if (window.attachEvent) {
      object.attachEvent('on' + eventName, func);
    }
  }
  
  function createXMLHttpRequest() {
    try { return new XMLHttpRequest(); } catch(e) {}
    try { return new ActiveXObject( 'Msxml2.XMLHTTP' ); } catch (e) {}
    try { return new ActiveXObject( 'Microsoft.XMLHTTP' ); } catch (e) {}
    return null;
  }
  
  function getRequest(url, callback) {
    var xhr = createXMLHttpRequest();
    xhr.open("get", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback(xhr.status !== 200 ? 'error' : null, JSON.parse(xhr.responseText));
      }
    };
    
    xhr.send(null);
  }
  
  function getIncidents(urls, callback) {
    var pendingCallbacks = [];
    var results = [];
    var resultErr = null;
    for (var i = 0; i < urls.length; i++) {
      pendingCallbacks.push(function (err, result) {
        if (err) {
          resultErr = err;
          callback(err);
        } else {
          results.push(result);
        }
        
        if (!resultErr) {
          pendingCallbacks.splice(0, 1);
          if (pendingCallbacks.length === 0) {
            callback(null, results);
          } 
        }
      });
    }
    
    for (var i = 0; i < urls.length; i++) {
      getRequest(urls[i], pendingCallbacks[i]);
    }
  }
  
  function hideIncidents() {
    var incidents = document.getElementById("incidents");
    if (incidents) {
      incidents.style.display = 'none';
    }
  }
  
  function showIncidents(incidents) {
    var incidentsElement = document.getElementById("incidents");
    if (!incidentsElement) {
      incidentsElement = document.createElement("div");
      incidentsElement.id = 'incidents';
      incidentsElement.style.position = 'fixed';
      incidentsElement.style.left = '0';
      incidentsElement.style.right = '0';
      incidentsElement.style.top = '0';
      incidentsElement.style.zIndex = 99999;
      
      var incidentsHideElement = document.createElement('div');
      incidentsHideElement.innerHTML = 'X';
      incidentsHideElement.style.padding = '10px';
      incidentsHideElement.style.position = 'absolute';
      incidentsHideElement.style.right = '10px';
      incidentsHideElement.style.color = '#fff';
      incidentsHideElement.style.fontSize = '16px';
      incidentsHideElement.style.cursor = 'pointer';
      incidentsHideElement.setAttribute("title", 'Piilota');
      
      incidentsElement.appendChild(incidentsHideElement);
      document.body.appendChild(incidentsElement);
              
      addListener(incidentsHideElement, 'click', function () {
        clearInterval(interval);
        incidentsElement.style.display = 'none';
      });
    }
    
    var oldIncidents =  document.getElementsByClassName('incident');
    while (oldIncidents.length) {
      incidentsElement.removeChild(oldIncidents[0]);
    }
    
    for (var i = 0; i < incidents.length; i++) {
      var incidentElement = document.createElement("div");
      incidentElement.style.background = incidents[i].severity === 'severe' ? 'rgba(255, 0, 0, 0.75)' : 'rgba(255, 128, 0, 0.75)';
      incidentElement.style.textAlign = 'center';
      incidentElement.style.color = '#fff';
      incidentElement.style.padding = '5px';
      incidentElement.style.fontSize = '16px';
      incidentElement.className = 'incident';
      incidentElement.innerHTML = '<div style="font-size: 16px; font-weight:bold">' + incidents[i].title + '</div><div>' + incidents[i].description + '</div>';
      incidentsElement.appendChild(incidentElement);
    }
  }
  
  function onWindowLoad() {
    var scriptElement = document.getElementById("incidents-script");
    if (!scriptElement) {
      return;
    }
    
    var urls = scriptElement.getAttribute("data-urls");
    if (urls) {
      interval = setInterval(function () {
        try {
          getIncidents(urls.split(','), function (err, incidentSets) {
            var incidents = [];

            for (var i = 0; i < incidentSets.length; i++) {
              incidents = incidents.concat(incidentSets[i]);
            }

            if (!err) {
              showIncidents(incidents);
            }
          });
        } catch (e) {
          
        }
      }, parseInt(scriptElement.getAttribute("data-interval"))|60000);
    }
  }
  
  addListener(window, 'load', onWindowLoad);
  
}).call(this);