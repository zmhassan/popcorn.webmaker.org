/* This Source Code Form is subject to the terms of the MIT license
 * If a copy of the MIT license was not distributed with this file, you can
 * obtain one at https://raw.github.com/mozilla/butter/master/LICENSE */

( function( Butter ) {

  Butter.Editor.register( "sketchfab", "load!{{baseDir}}templates/assets/editors/sketchfab/sketchfab-editor.html",
    function( rootElement, butter ) {

    var _this = this;

    var _rootElement = rootElement,
        _trackEvent;

    function onTrackEventUpdated( e ) {
      _trackEvent = e.target;
      _this.updatePropertiesFromManifest( _trackEvent );
      _this.setErrorState( false );
    }

    function updateTrackEvent( te, prop ) {
      _this.setErrorState( false );
      _this.updateTrackEventSafe( te, prop );
    }

    // Extend this object to become a BaseEditor
    Butter.Editor.TrackEventEditor.extend( _this, butter, rootElement, {
      open: function( parentElement, trackEvent ) {
        var popcornOptions = trackEvent.popcornOptions;
        _trackEvent = trackEvent;

        var optionsContainer = _rootElement.querySelector( ".editor-options" );

        optionsContainer.appendChild( _this.createStartEndInputs( trackEvent, updateTrackEvent ) );

        _this.createPropertiesFromManifest({
          trackEvent: trackEvent,
          basicContainer: optionsContainer,
          ignoreManifestKeys: [ "target", "start", "end" ],
          callback: function( elementType, element, trackEvent, name ) {
            var handlerMap = {
              select: 'attachSelectChangeHandler',
              checkbox: 'attachCheckboxChangeHandler'
            };

            // Waterfall handler identification: handlerMap[input|select] -> handlerMap[checkbox] -> 'attachInputChangeHandler'
            var handlerFunction = handlerMap[ elementType ] || handlerMap[ element.type ] || 'attachInputChangeHandler';
            _this[ handlerFunction ]( element, _trackEvent, element.getAttribute( "data-manifest-key" ), updateTrackEvent );
          }
        });

        optionsContainer.appendChild( _this.createSetAsDefaultsButton( trackEvent ) );
        _this.updatePropertiesFromManifest( trackEvent );
        _this.scrollbar.update();

        _this.setTrackEventUpdateErrorCallback( _this.setErrorState );

        trackEvent.listen( "trackeventupdated", onTrackEventUpdated );
      },
      close: function() {
        _trackEvent.unlisten( "trackeventupdated", onTrackEventUpdated );
      }
    });
  });
}( window.Butter ));
