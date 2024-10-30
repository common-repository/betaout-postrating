/*!
 * wordpress plugin rating API Library V1
 *
 * Date: april 2011
 * Amit kumar srivastava
 * amit.srivastava@instablogs.com,amee9451@gmail.com
 */
var wordpress=new Object();
wordpress.ratingModule={
    contentArray :new Array(),
    sendRatingData : function(contentId,ratingData) {
      var dataString="pid="+contentId+"&action=borating"+"&rating="+ratingData;
          jQuery.ajax({
               "url": boratingL10n.ajax_url,
               "data":dataString,
               async:true,
               dataType:'json',
               "success": function(resp) {
                       var reference=jQuery('div[engage-ratingData-contentId="'+contentId+'"]').parent().children('span');
                       reference.text(resp.totalAverage+" / 5 ("+resp.totalCount+" Reviews)");
               },
               "error": function() {
               }
           });
    },
    loadPreviousRatingData : function(data) {
              jQuery.ajax({
                   url: boratingL10n.ajax_url,
                   data:{
                       'pid':data,
                       'action':'ratingdata'
                   },
                   async:false,
                   dataType:'json',
                   "success": function(resp) {

                           setTimeout(function(){
                               for(id in resp ){
                                   var reference=jQuery('div[engage-ratingData-contentId="'+id+'"]').parent().children('span');
                                   reference.text(resp[id]['totalAverage']+" / 5 ("+resp[id]['totalCount']+" Reviews)");
                                   if(jQuery('div[engage-ratingData-contentId="'+id+'"]').attr('engage_ratingType')=="half"){
                                       var fillWidth=(jQuery('div[engage-ratingData-contentId="'+id+'"]').children('div:first').width());
                                      jQuery('div[engage-ratingData-contentId="'+id+'"]').children('div:last').css({
                                           width:fillWidth*resp[id]['totalAverage']
                                       })
                                   }else{
                                       var ids=jQuery('div[engage-ratingData-contentId="'+id+'"]').attr('id');
                                       var ratingIconName=jQuery("#"+ids).attr('engage_ratingIcon');
                                       var ratingIconSize=jQuery("#"+ids).attr('engage_ratingIconSize');
                                       var setIconRang=(resp[id]['totalAverage']);
                                       var refs=jQuery("#"+ids).children('div');
                                       if(setIconRang<1){
                                       }else{
                                           for(i=1;i<(setIconRang);i++){
                                               refs.css({
                                                   'position': 'relative'
                                               })
                                               refs=refs.next();
                                           }
                                           refs.prevAll().andSelf().addClass(ratingIconName+'Red'+ratingIconSize);
                                           refs.nextAll().removeClass(ratingIconName+'Red'+ratingIconSize);
                                           refs.nextAll().addClass(ratingIconName+'Black'+ratingIconSize);
                                       }
                                   }
                               }
                           },2000);
                   },
                   "error": function() {
                   }
               });
       jQuery(".engage_ratingDiv").each(function(){
            var width=jQuery(this).css('width');
            if(parseInt(width)==110){
                width='130px';
            }
           jQuery(this).parent().css({
                width:width
            })

        });
    },
    initCall:function(){
        try{
           jQuery(".engage_ratingDiv").each(function(i){
               jQuery(this).wrap(function(){
                    return '<div/>';
                });
               jQuery(this).attr('id','engage_ratingDiv_'+(i+1));
                if(parseInt(jQuery(this).attr('engage-ratingData-contentId'))){
                    wordpress.ratingModule.contentArray[i]=parseInt(jQuery(this).attr('engage-ratingData-contentId'));
                }else{
                    wordpress.ratingModule.contentArray[i]=0;
                }
                wordpress.ratingModule.ratingCreate(jQuery(this).attr('engage_ratingIcon'),jQuery(this).attr('engage_ratingIconSize'),jQuery(this).attr('engage_ratingType'),jQuery(this).attr('engage_ratingSetting'),'engage_ratingDiv_'+(i+1))
            });
            wordpress.ratingModule.loadPreviousRatingData(wordpress.ratingModule.contentArray);
           jQuery(".engage_ratingDiv").each(function(){
               jQuery(this).after('<span style="font-size: 10px;left: 0;position: relative;display: inline-block;"></span>');
            });
        }catch(e){

        }
    },
    ratingCreate: function(ratingIconName,ratingIconSize,ratingType,ratingDivSetting,divId) {
       jQuery('.engage_tips').remove();
       jQuery('body').prepend('<div class="engage_tips" style="display:none"><i class="engage_arrow-up"></i><span></span></div>');
        var titleArray=new Array('Good','Nice','Fantastic','Fabulous','Tremendous')
        ratingDivSetting =(ratingDivSetting).split('_');
        if(ratingType=="half"){
            var rate="",ratingdData="";
            for(i=1;i<=5;i++){
                rate +='<div class="hover '+ratingIconName+'Black'+ratingIconSize+'"></div>';
            }
           jQuery("#"+divId).html(rate+'<div class="'+ratingIconName+'Red'+ratingIconSize+'" style="width:0px"></div>');
           jQuery("#"+divId).css({
                width:ratingDivSetting[0],
                height:ratingDivSetting[1],
                'position':'relative'
            });
            var divOffsetLeft=(parseInt(jQuery('#'+divId).offset().left));
           jQuery('#'+divId).live('mousemove',function(e){
               jQuery("#"+divId+' .'+ratingIconName+'Red'+ratingIconSize).css({
                    width:parseInt(e.pageX-divOffsetLeft)
                });
               jQuery(".engage_tips").css({
                    top:e.pageY+(jQuery("#"+divId+" div:first").height()),
                    left:e.pageX-20,
                    'z-index':1000
                });
                var textHoverValue=((e.pageX-divOffsetLeft)/(parseInt(jQuery('#'+divId+' .hover:first').width()))).toFixed(2)
                /*var textHoverValueMatch=(Math.abs(textHoverValue ) % 1);
                if(textHoverValueMatch===0){
                textHoverValue=parseInt(textHoverValue)
                }*/
                var textHoverValueMatch=(textHoverValue ) % 1;
                var textHoverValueMatch1=(textHoverValue-textHoverValueMatch);
                if(textHoverValueMatch > 0.50){
                textHoverValue=Math.round(textHoverValue);
                }else{
                textHoverValue=textHoverValueMatch1+0.50
                }
               jQuery(".engage_tips span").text(textHoverValue > 0.5 ? textHoverValue+" / 5" : '0.5' +" / 5");
               jQuery(".engage_tips").show();
                ratingdData=textHoverValue
            });
           jQuery('#'+divId).live('mouseleave',function(){
                var setIconRang=(jQuery(this).parent().find('span').text()).split('/')
                if(parseInt(setIconRang[0])>1){
                    var fillWidth=jQuery(this).children('div:first').width();
                   jQuery(this).children('div:last').css({
                        width:fillWidth*parseInt(setIconRang[0])
                    });
                }else{
                   jQuery("#"+divId+' .'+ratingIconName+'Red'+ratingIconSize).css({
                        width:0
                    });
                }
               jQuery(".engage_tips").hide();
            })
           jQuery('#'+divId).live('click',function(e){
               jQuery('#'+divId).die('mousemove');
               jQuery('#'+divId).die('mouseleave');
               jQuery('#'+divId).die('click');
                wordpress.ratingModule.sendRatingData(jQuery(this).attr('engage-ratingData-contentId'),ratingdData);
               jQuery('#'+divId).children().removeClass('hover');
               jQuery(".engage_tips").hide();
                e.stopImmediatePropagation();
            });
        }else{
           jQuery('#'+divId).unbind('mousemove');
            var rate="";
            for(i=1;i<=5;i++){
                rate +='<div engage_ratingData="'+(i)+'" engage_ratingTitle="'+titleArray[(i-1)]+': '+(i)+' / 5" class="hover '+ratingIconName+'Black'+ratingIconSize+'"></div>';
            }
           jQuery('#'+divId).html(rate);
           jQuery('#'+divId).css({
                width:ratingDivSetting[0],
                height:ratingDivSetting[1]
            });

           jQuery("#"+divId+" .hover").hover(function(e){
                var offSet=jQuery(this).offset();
               jQuery(".engage_tips").css({
                    top:offSet.top+(jQuery("#"+divId+" div:first").height())+10,
                    left:offSet.left,
                    'z-index':1000
                });
               jQuery("#"+divId+' .hover').live('click',function(e){
                    wordpress.ratingModule.sendRatingData(jQuery(this).parent().attr('engage-ratingData-contentId'),jQuery(this).attr('engage_ratingdata'))
                   jQuery("#"+divId+" .hover").unbind('hover');
                   jQuery("#"+divId).children().removeClass('hover');
                   jQuery(".engage_tips").hide();
                    e.stopImmediatePropagation();
                    return false;
                });
               jQuery(this).prevAll().andSelf().css({
                    'position':'relative'
                });
               jQuery(this).nextAll().addClass(ratingIconName+'Black'+ratingIconSize);
               jQuery(this).nextAll().removeClass(ratingIconName+'Red'+ratingIconSize);
               jQuery(this).prevAll().andSelf().removeClass(ratingIconName+'Black'+ratingIconSize);
               jQuery(this).prevAll().andSelf().addClass(ratingIconName+'Red'+ratingIconSize);
               jQuery(".engage_tips span").text(jQuery(this).attr('engage_ratingTitle'));
               jQuery(".engage_tips").show();
            },
            function(){
               jQuery(".engage_tips").hide();
                var id=jQuery(this).parent().attr('id');
                //                var setIcon=jQuery("#"+id).attr('engage_ratingicon');
                var setIconRang=(jQuery("#"+id).parent().children('span').text()).split('/')
                if(setIconRang[0]<1){
                   jQuery(this).prevAll().andSelf().removeClass(ratingIconName+'Red'+ratingIconSize);
                   jQuery(this).prevAll().andSelf().addClass(ratingIconName+'Black'+ratingIconSize);
                }else{
                    var refs=jQuery("#"+id).children('div');
                    for(i=1;i<(parseInt(setIconRang[0])/2);i++){
                        refs=refs.next()
                    }
                    refs.prevAll().andSelf().addClass(ratingIconName+'Red'+ratingIconSize);
                    refs.nextAll().removeClass(ratingIconName+'Red'+ratingIconSize);
                    refs.nextAll().addClass(ratingIconName+'Black'+ratingIconSize);
                }
            });
        }
    },
    ratingLoad : function() {
        try{
            wordpress.ratingModule.initCall();
        }catch(e){}
    }
}
setTimeout(function(){
wordpress.ratingModule.ratingLoad();
},2000);