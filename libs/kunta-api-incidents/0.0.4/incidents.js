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
      
      var incidentsHideElement = document.createElement('div');
      incidentsHideElement.className = 'incidents-hide';      
      incidentsHideElement.innerHTML = 'X';
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
    
    if (incidents.length) {
      incidentsElement.style.display = 'block';
      for (var i = 0; i < incidents.length; i++) {
        var incidentElement = document.createElement("div");
        incidentElement.className = 'incident incident-' + incidents[i].severity;
        
        if (incidents[i].title) {
          var incidentTitleElement = document.createElement("div");
          incidentTitleElement.className = 'incident-title';
          incidentTitleElement.innerHTML = incidents[i].title;
          incidentElement.appendChild(incidentTitleElement);
        }
        
        if  (incidents[i].description) {
          var incidentDescriptionElement = document.createElement("div");
          incidentDescriptionElement.innerHTML = incidents[i].description;
          incidentElement.appendChild(incidentDescriptionElement);
        }
      
        if (incidents[i].detailsLink) {
          var incidentDetails = document.createElement("div");
          
          var incidentLinkElement = document.createElement("a");
          incidentLinkElement.innerHTML = incidents[i].detailsLinkText || incidents[i].detailsLink;
          incidentLinkElement.href = incidents[i].detailsLink;
          incidentLinkElement.target = '_blank';
          incidentLinkElement.className = 'incident-details-link';
          incidentDetails.appendChild(incidentLinkElement);
          incidentElement.appendChild(incidentDetails);
        }
        
        incidentsElement.appendChild(incidentElement);
      }
    } else {
      incidentsElement.style.display = 'none';
    }
  }
  
  function checkIncidents(urls) {
    getIncidents(urls, function (err, incidentSets) {
      var incidents = [];

      for (var i = 0; i < incidentSets.length; i++) {
        incidents = incidents.concat(incidentSets[i]);
      }

      if (!err) {
        showIncidents(incidents);
      }
    });
  }
  
  function onWindowLoad() {
    var scriptElement = document.getElementById("incidents-script");
    if (!scriptElement) {
      return;
    }
    
    var urlsAttribute = scriptElement.getAttribute("data-urls");
    if (urlsAttribute) {
      var urls = urlsAttribute.split(',');
      checkIncidents(urls);
      
      interval = setInterval(function () {
        try {
          checkIncidents(urls);
        } catch (e) { 
          
        }
      }, parseInt(scriptElement.getAttribute("data-interval"))|60000);
    }
  }
  
  addListener(window, 'load', onWindowLoad);
  
}).call(this);