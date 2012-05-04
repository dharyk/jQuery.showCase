/**
 *  Showcase for news headlines
 *  Author:   Miguel Guerreiro
 *  Updated:  2012-05-03
 */
;(function($) {
  var instances = {},
      numInst = 0;
  $.fn.showCase = function(options) {
    //
    var me = this;
    // defaults
    var defaults = {
          width: 680,
          height: 350,
          interval: 3000,
          titleHeight: 60,
          navWidth: 240
        };
    // extend the options passed with the defaults
    var settings = $.extend({},defaults,options);
    // create the inner elements
    var $title = $('<div/>',{
          'class': 'showcase-title'
        }),
        $navigator = $('<div/>',{
          'class': 'showcase-navigator'
        }),
        $navitem = $('<div/>',{
          'class': 'showcase-item'
        }),
        $focus = $('<div/>',{
          'class': 'showcase-focus'
        });
    // modify the focus info display
    function __do_modifyFocus(data,index) {
      var $cnt = $('#'+data.container),
          $nav = $('#'+data.navigator),
          $ttl = $('#'+data.title),
          $foc = $('#'+data.focus),
          $navitem = $('#item-'+data.container+'-'+index),
          navData = $navitem.data();
      // remove the selected class from other items
      $nav.find('.showcase-item.showcase-selected').removeClass('showcase-selected');
      // set current item as the selected one
      $navitem.addClass('showcase-selected');
      // update the title to the current item's title
      $ttl.html(
        ['<a href="',navData.url,'">',navData.title,'</a>'].join('')
      );
      // update the focus image to the current item's
      $foc.find('img').attr('alt', navData.title).attr('src',navData.image);
      // update the focus description to the current item's
      $foc.find('span').html(navData.description);
    }
    // when an item is hovered over
    function __on_itemOver(evt) {
      var $nav= $(this),
          navData = $nav.data();
      // set the current to self
      instances[navData.container].current = navData.index;
      // pause the instance's interval
      instances[navData.container].interval = clearInterval(instances[navData.container].interval);
      __do_modifyFocus($('#'+navData.container).data(),navData.index);
    }
    // when an item is hovered out
    function __on_itemOut(evt) {
      var $nav= $(this),
          navData = $nav.data();
      // restart the instance's interval
      instances[navData.container].interval = setInterval(instances[navData.container].looper,settings.interval);
    }
    function __on_loop(name,inst) {
      var $cnt = $('#'+name);
      inst.current = ++inst.current % inst.itemCount;
      __do_modifyFocus($cnt.data(),inst.current);
    }
    // parse the content of the element for items
    function __parse_contents(elemId) {
      var found = $('#'+elemId).children('div'),
          i, item;
      // get all items
      instances[elemId] = {
        interval: null,
        looper: null,
        current: 0,
        itemCount: found.length,
        items: []
      }
      for (i=0; i<instances[elemId].itemCount; i++) {
        item = $(found[i]);
        instances[elemId].items.push({
          id: item.attr('id').split('-')[1],
          index: i,
          date: item.find('span.item-date').html(),
          url: item.find('span.item-url').html(),
          title: item.find('span.item-title').html(),
          image: item.find('span.item-image').html(),
          description: item.find('span.item-description').html()
        });
      }
      
    }
    // initialization function
    function __init_showCase(index, elem) {
      var $container = $(elem),
          $cntTitle = $title.clone(),
          $cntNavigator = $navigator.clone(),
          $cntFocus = $focus.clone(),
          cntId = $container.attr('id') || 'showcase'+numInst++,
          titleId = cntId+'-title',
          navigatorId = cntId+'-navigator',
          focusId = cntId+'-focus',
          cntData = {
            container: cntId,
            title: titleId,
            navigator: navigatorId,
            focus: focusId
          };
      var i, $item, itemData;
      // set the container id
      $container.attr('id', cntId);
      // find the items
      __parse_contents(cntId);
      // setup the title element
      $cntTitle
        .attr('id', titleId)
        .css({
          width: settings.width,
          height: settings.titleHeight
        });
      // setup the navigator element
      $cntNavigator
        .attr('id', navigatorId)
        .css({
          width: settings.navWidth,
          height: (settings.height - settings.titleHeight)
        });
      for (i=0; i<instances[cntId].itemCount; i++) {
        $item = $navitem.clone();
        itemData = instances[cntId].items[i];
        itemData.container = cntId;
        $item
          .attr('id','item-'+cntId+'-'+itemData.index)
          .html(
            ['<div class="showcase-item-text" style="width:',settings.navWidth-26,'px;">',instances[cntId].items[i].title,'</div>',
            '<div class="showcase-item-after"></div>'].join('')
          )
          .css({
            width: settings.navWidth-10
          })
          .hover(__on_itemOver,__on_itemOut)
          .data(itemData)
          .appendTo($cntNavigator);
      }
      // setup the focus element
      $cntFocus
        .attr('id', focusId)
        .css({
          width: (settings.width - settings.navWidth),
          height: (settings.height - settings.titleHeight)
        })
        .html('<img alt="" src="" /><span></span>');
      // setup the element container
      $container
        .addClass('showcase-container')
        .append($cntTitle)
        .append($cntFocus)
        .append($cntNavigator)
        .data(cntData)
        .css({
          width: settings.width,
          height: settings.height
        });
      // it's all set up, initialize the interval
      instances[cntId].looper = function() {
        __on_loop.apply(me,[cntId,instances[cntId]]);
      }
      instances[cntId].interval = setInterval(instances[cntId].looper,settings.interval);
      // initialize the focus with the first item
      __do_modifyFocus(cntData,0);
    }
    // allow multiple elements to be initialized with one call
    me.each(__init_showCase);
    // allow chaining
    return me;
  };
}(jQuery));