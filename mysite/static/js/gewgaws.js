$.fn.toggleText = function(text1, text2) {
  newtext = (this.text() == text2) ? text1 : text2;
  return this.text(newtext);
}
// Return the available content height space in browser window

// FIXME: This doesn't handle a bottom scrollbar well.
$.viewportHeight = function() { var h = 0; if (typeof(window.innerHeight) == "number") { h = window.innerHeight; } else { if (document.documentElement && document.documentElement.clientHeight) { h = document.documentElement.clientHeight; } else { if (document.body && document.body.clientHeight) { h = document.body.clientHeight; } } } return h; }

$.fn.scrollIntoView = function() {
  elemTop = this.offset().top;
  elemBottom = elemTop + this.height();
  scrollTop = $(document).scrollTop();
  viewportHeight = $.viewportHeight();
  scrollBottom = scrollTop + viewportHeight;
  if (elemTop < scrollTop)  {
    $.scrollTo(this, 0, {offset: -5});
  }
  if (elemBottom > scrollBottom) {
    $.scrollTo(elemBottom - viewportHeight + 10);
  }
}


$(document).ready(function() {

    Gewgaws.lightGewgaw(0);

    $('#expand-all-link').click(function() {
      $('.gewgaws li').addClass('expanded');
      return false;
      });

    $('#collapse-all-link').click(function() {
      $('.gewgaws li').removeClass('expanded');
      return false;
      });

    $(document).bind('keyup', 'j', Gewgaws.moveGewgawFocusDown);
    $(document).bind('keyup', 'n', Gewgaws.moveGewgawFocusDown);

    $(document).bind('keyup', 'k', Gewgaws.moveGewgawFocusUp);
    $(document).bind('keyup', 'p', Gewgaws.moveGewgawFocusUp);

    $(document).bind('keyup', 'o', function() {
      $litGewgaw = $('.gewgaws li').eq(Gewgaws.getLitGewgawIndex());
      $litGewgaw.toggleClass('expanded').scrollIntoView();
      });

    $('.first-line').hover(
        function() { $(this).addClass('hover'); },
        function() { $(this).removeClass('hover'); }
        );

    $('.first-line').click(function () {
        $(this.parentNode.parentNode).toggleClass('expanded').scrollIntoView();
        return false;
        });

    $('.show-details').click(function () {
        $(this.parentNode.parentNode.parentNode).toggleClass('expanded').scrollIntoView();
        return false;
        });

    $('.first-line a.title').click(function () {
        $(this.parentNode.parentNode.parentNode).toggleClass('expanded').scrollIntoView();
        return false;
        });

    /* Takes a query and updates the page. */
    $("#button").click(function() {
        /* Put form values into an associative array. */
        return Gewgaws.update($('form').serializeArray());
        });


    $('#prev-page, #next-page').click(function() {
        /* Take the HREF and convert to wacky serializeArray, send to update() */
        var fruitySerialized = new Array();
        var splitted_on_ampersands = this.href.split('?')[1].split('&');
        for (var index in splitted_on_ampersands) {
        var splitted = splitted_on_ampersands[index].split('=');    
        var key = decodeURIComponent(splitted[0]);
        var value = decodeURIComponent(splitted[1]);
        var fruity_pushable = {'name': key, 'value': value};
        /* update the thisstart and thisend globals */
        if (key == 'start') {
        thisstart = parseInt(value);
        }
        if (key == 'end') {
        thisend = parseInt(value);
        }
        fruitySerialized.push(fruity_pushable);
        }
        console.log('FRUITYSERIALIZED:');
        console.log(fruitySerialized);
        console.log('SLASH FRUITYSERIALIZED:');

        return Gewgaws.update(fruitySerialized);
    });
});

Gewgaws = {
  'gewgawsQueryURL': "/search/?",
  '$gewgawsDOMList': $('.gewgaws ul'),
  'getLitGewgawIndex': function() {
    // FIXME: Remember the index of the lit gewgaw in Javascript,
    // and avoid going through CSS.
    return $('.gewgaws li').index($('.lit-up')[0]);
  },
  'fetchGewgawsToDOM': function (queryString) {
    url = this.gewgawsQueryURL + queryString + "&jsoncallback=?";
    $.getJSON(url, this.jsonArrayToDocument);
  },
  'jsonArrayToDocument': function (jsonArray) {
    $(jsonArray).each( function(i) {
        $gewgaw = $("li").eq(i);
        $gewgaw.attr('id', "gewgaw-" + this.pk);

        $gewgaw.find('.project').text(this.fields.project);
        $gewgaw.find('.title').text(this.fields.title);
        $gewgaw.find('.description').text(this.fields.description);
        });
  },
  'lightGewgaw': function(gewgawIndex) {
    if($('.gewgaws li').eq(gewgawIndex).size() == 1) {
      $('.gewgaws li')
        .removeClass('lit-up')
        .eq(gewgawIndex).addClass('lit-up').scrollIntoView();
      // FIXME: Automatically scroll when gewgaw is expanded such that its content is off-screen.
    }
    else {
      console.log('no gewgaw to highlight');
    }
  },
  'update': function(queryArray) {
    queryArray.push({'name': 'format', value: 'json'});

    queryStringFormatJSON = $.param(queryArray);

    /* Fetch JSON and put in DOM. */
    Gewgaws.fetchGewgawsToDOM(queryStringFormatJSON);

    /* Update navigation links */
    var language;
    $(queryArray).each(function () {
        if(this.name == 'language') language = this.value;
        })

    diff = thisend - thisstart;

    prevPageQueryArray = $('form').serializeArray();
    prevPageQueryArray.push( {'name': 'start', 'value': thisstart - diff - 1});
    prevPageQueryArray.push( {'name': 'end', 'value': thisstart - 1});

    nextPageQueryArray = $('form').serializeArray();
    nextPageQueryArray.push( {'name': 'start', 'value': thisend + 1});
    nextPageQueryArray.push( {'name': 'end', 'value': thisend + diff + 1});

    /* Update navigation links to reflect new query. */
    prefix = '/search/?';
    $('#prev-page').attr('href', prefix + $.param(prevPageQueryArray));
    $('#next-page').attr('href', prefix + $.param(nextPageQueryArray));

    $('#results-summary-language').text(language);
    $('#results-summary-start').text(thisstart);
    $('#results-summary-end').text(thisend);

    return false;
  },
  'moveGewgawFocusDown': function() {
    Gewgaws.lightGewgaw(Gewgaws.getLitGewgawIndex() + 1);
  },
  'moveGewgawFocusUp': function() {
    Gewgaws.lightGewgaw(Gewgaws.getLitGewgawIndex() - 1);
  }
}

/* vim:set sw=2 ts=2 expandtab: */