function is_hidden(obj) {
    return (obj.className == 'should_be_hidden');
}

function my_hide(obj) {
    obj.className = 'should_be_hidden';
}

function my_show(obj) {
    if (is_hidden(obj)) {
        obj.className = '';
    }
}

function do_something_to_inaccessible_islanders(func) {
    for (var i = 0; i < inaccessible_islanders.length; i++) {
        func(inaccessible_islanders[i]);
    }
}


has_the_inaccessible_marker_been_pushed_to_the_list_of_markers = false;

PeopleMapController = function () {
    this.explainUninhabitedIsland = function (originatingLink) {
        var message = "People who haven't set their locations appear " + 
            "on an uninhabited island in the South Atlantic.";
        if (nudgeUserAboutLocation) {
            message += "<br><br>" +
                "To set your location, click 'settings' in the top-right " +
                "corner of your screen.";
        }

        var cssClass = 'uninhabited_island_message_triggered_by_' + originatingLink;
        var aMessageIsAlreadyVisible = ($('.jGrowl-notification.' + cssClass).size() > 0);

        if(!aMessageIsAlreadyVisible) {
            // "theme" sets an arbitrary css class
            $.jGrowl(message, { position: "center", theme: cssClass, life: 10000 });
        }
    };
};

PeopleMapController.prototype.geocode = function(data, callback) {
    var location_object = geocode_person_id_data[data['person_id']];
    var success;
    if (typeof data == 'undefined') {
        success = false;
    } else {
        success = true;
    }
    callback(location_object, success);
};

PeopleMapController.theUpdateMarkersTimeout = null;

PeopleMapController.theUpdateMarkersTimeoutDelay = 2000;

PeopleMapController.prototype.initialize = function(options) {
    this.person_locations = {};

    var number_of_people_geocoded = 0;
    this.get_number_of_people_geocoded = function() { return number_of_people_geocoded; };
    var update_all_markers;

    var person_id2data = options['person_id2data'];
    this.get_person_id2data = function() { return person_id2data; };

    //these two might not be the same because we store location strings
    //even if we can't geocode them
    var num_of_persons_with_locations_in_db = options['num_of_persons_with_locations'];
    var num_of_persons_who_can_be_geocoded = num_of_persons_with_locations_in_db;

    var all_markers = [];

    this.mapOrigin = new google.maps.LatLng(options.center.latitude,
        options.center.longitude);
    var myOptions = {
        'zoom': options.center.suggested_zoom_level,
        'center': this.mapOrigin,
        'mapTypeId': google.maps.MapTypeId.ROADMAP
    };

    var $canvas = $('#map_canvas');

    update_people_count = function () {
        function update_inaccessible_island_help() {
            // hide the text, "including people who have not set a location"
            if (! $('.inaccessible_islander:eq(0)').is(':visible')) {
                $('#people_without_locations').hide();
            } else {
                $('#people_without_locations').show();
            }
        }
        
        $('.dont_show_until_map_loads').show();

        var mappedPeople_count = $("#people-list li:not(.should_be_hidden)").size();

        $('#show_everybody').show();
        var str = mappedPeople_count;
        if (mappedPeople_count == 0) {
            str = "Nobody";
        }

        str = "<strong>"+str+"</strong>";

        // Add the form of "to be"
        if (mappedPeople_count == 0 || mappedPeople_count == 1) {
            str += " is";
        }
        else {
            str += " are";
        }

        $('#how_many_people_are_visible_label').show();
        $('#how_many_people_are_visible').html(str);

        update_inaccessible_island_help();
    }; // end function update_people_count

    this.updatePeopleCount = update_people_count;

    // This allows you to access the map globally, on this object
    this.map = new google.maps.Map($canvas.get(0), myOptions);

    // Hide the background image after 2.5 seconds.
    var hideBGImage = function () { $canvas.css('background', ''); };
    window.setTimeout(hideBGImage, 2500);

    function generate_update_all_markers(mapController) {
        var closure = function() {
            /* This function is executed every time the map bounds change. */

            var map = mapController.map;

            /* This only makes up to 10 people show on the right. */
            var shown_this_many = 0;

            for (var i = 0; i < all_markers.length; i++) {
            
                var marker = all_markers[i];

                /* If that marker is the Inaccessible Island marker, then we should 
                 * hide all the inaccessible people.
                 */
                var person_summary = document.getElementById('person_summary_' +
                        marker.person_id);
                var bounds = map.getBounds();
                if (typeof bounds != 'undefined' &&
                    bounds.contains(marker.position)) {
                    
                    // If the person bullet is hidden,
                    if(is_hidden(person_summary)) {
                        /* If the marker we found is for inaccessible people, show them all */
                        if (marker === mapController.the_marker_for_inaccessible_island) {
                            do_something_to_inaccessible_islanders(my_show);
                        }
                        else { /* just the one guy or gal */
                            my_show(person_summary);
                        }
                    }
                    shown_this_many += 1;
                }
                else {
                    /* If the marker we found is for inaccessible people, hide them all */
                    if (marker === mapController.the_marker_for_inaccessible_island) {
                        do_something_to_inaccessible_islanders(my_hide);
                    }
                    else {
                    /* otherwise hide just that one person */
                        my_hide(person_summary);
                    }
                } 
            } // end for
            update_people_count();
            $('#thinking').hide();
            PeopleMapController.isPeopleListThrobberVisible = false;

        }; // end definition of closure
        return closure;
    } // end function generate_update_all_markers
    
    update_all_markers = generate_update_all_markers(this);
    this.update_all_markers = update_all_markers;

    update_all_markers_eventually = function () {
        window.clearTimeout(PeopleMapController.theUpdateMarkersTimeout);
        if (! PeopleMapController.isPeopleListThrobberVisible) {
            $('#thinking').show();
            PeopleMapController.isPeopleListThrobberVisible = true;
        }
        PeopleMapController.theUpdateMarkersTimeout = window.setTimeout(
            update_all_markers, PeopleMapController.theUpdateMarkersTimeoutDelay);
    };
    this.update_all_markers_eventually = update_all_markers_eventually;

    this.the_marker_for_inaccessible_island = null;

    /*
     * This function is called with an option named "person_id2data".
     * This is a JS object (sort of like a Python dictionary)
     * mapping the primary keys of Django-side Person objects to
     * a JS object containing information about that person.
     *
     * (We smuggled the Python data into JavaScript by having Python
     * write a certain bit of JavaScript that defines a JS object.
     * That all happens in a piece of inline JS, in the template
     * located at profile/templates/profile/map.html .)
     */
    for (var person_id in person_id2data) {
        var data = person_id2data[person_id];
        var location_name = data['location'];
        var is_wannabe = data['wanna_help'];

        var name = data['name'];

        function create_a_callback(mapController, person_name, person_id) {

            // As specified after the "create_a_callback" function,
            // the following callback will be executed when the
            // Google Maps API responds to our request for geographic data.
            return function(json_data, it_worked) {
                number_of_people_geocoded += 1;

                if (! it_worked) {
                    num_of_persons_who_can_be_geocoded -=1;
                    return;
                }

                var is_inaccessible = json_data['is_inaccessible'];
                var person_location = new google.maps.LatLng(json_data['latitude'],
                    json_data['longitude']);

                var marker = null;

                if (is_inaccessible) {
                    person_name = '';
                    /* Grab the_marker_for_inaccessible_island, if we have already made it */
                    if (mapController.the_marker_for_inaccessible_island !== null) {
                        marker = mapController.the_marker_for_inaccessible_island;
                    }
                }

                if (marker === null) {
                    marker = new google.maps.Marker({
                            'map': mapController.map, 
                            'title': person_name,
                            'person_id': person_id,     
                            'position': person_location
                    });
                }

                shouldMakeAMarkerForInaccessibleIsland = (is_inaccessible && 
                    (mapController.the_marker_for_inaccessible_island === null));

                if (shouldMakeAMarkerForInaccessibleIsland) {
                    /* Then cache it */
                    mapController.the_marker_for_inaccessible_island = marker;

                    // Set event handler just once.
                    google.maps.event.addListener(
                        marker,
                        'click', function() {
                            mapController.explainUninhabitedIsland('marker');
                        }
                    );		    
                }
                mapController.person_locations['' + person_id] = person_location;

                mapController.map.setCenter(mapController.mapOrigin);

                if (!is_inaccessible) {
                    google.maps.event.addListener(
                        marker,
                        'click', function() {
                            mapController.highlightPerson(marker.person_id);
                            window.location.hash=('person_summary_' + marker.person_id);
                    });		    
                }

                // If this person has set their location, create a marker
                if (! is_inaccessible ) {
                    all_markers.push(marker); 
                }


                // If this person hasn't set their location, create a marker
                // only if we haven't already created the canonical
                // inaccessible island marker
                if ( is_inaccessible ) {
                    if (has_the_inaccessible_marker_been_pushed_to_the_list_of_markers) {
                        // Don't do anything, we've already pushed the
                        // inaccessible island marker
                    }
                    else {
                        all_markers.push(marker);
                        // The above line should run only once per map bounds
                        // change.
                        has_the_inaccessible_marker_been_pushed_to_the_list_of_markers = true;
                    }
                }

                /* if this is the last one, call update_all_markers() */
                if (num_of_persons_who_can_be_geocoded == number_of_people_geocoded) {
                    if (!showEverybody) {
                        // If the map has been summoned in a zoomed-in state, we want
                        // to run update_all_markers after we've created all the
                        // markers
                        update_all_markers_eventually();
                    }
                }
            };
        } // end function create_a_callback

        // Ask the OpenHatch Geocoder API ;-) for some geographic data, concerning a particular
        // location.
        this.geocode( { 'person_id': person_id},
            create_a_callback(this, name, person_id));
    } // end for loop

    google.maps.event.addListener(this.map,
        'bounds_changed',
        update_all_markers_eventually);
};

//this gets called when you click a marker on the map
PeopleMapController.prototype.highlightPerson = function(personId) {
    // Unhighlight everyone
    $('#people-list li.highlighted').removeClass("highlighted");
    //highlight the right person
    $('#person_summary_' + personId).addClass("highlighted");
};

PeopleMapController.isPeopleListThrobberVisible = false;

//binds the clickhandlers to people list items
PeopleMapController.prototype.bindClickHandlersToPeopleListItems = function() {
    //grab google's map object
    var me = this;
    //grab list of person locations
    //var person_locations = this.person_locations;
    //click handler for people list items
    handler = function(event) {
        thePersonLi = this;

        // Unhighlight everyone
        $('#people-list li.highlighted').removeClass("highlighted");

        // Highlight this person.
        $(thePersonLi).addClass("highlighted");

        //grab the person's database id from her dom id
        var thePersonId = thePersonLi.id.split("_")[2];

        // Center the map on it
        me.map.setCenter(me.person_locations[thePersonId]);

        // Center the map on their marker.

    }; // end function "handler"
    $('#people-list li').click(handler);
};
