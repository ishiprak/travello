athumb="static/travelbg.jpg";
acaption="Figure Caption";
alist=[];

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street=$("#street");
    var $city=$("#city");
    var $wikih=$("#wikipedia-header");

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $wikiElem.html("");
    $nytElem.html("");
    var st=$street.val();
    $street.val("");
    var ct=$city.val();
    $city.val("");
    $greeting.text("So, you want to live in "+ct+"? ");
    $nytHeaderElem.text("Loading Ny Times artices...");
    $wikih.text("Loading Wikipedia articles...");
    alist=[];
    athumb="static/travelbg.jpg";
    acaption="Figure Caption";
    $("img").attr("src",athumb);
    $("figcaption").text(acaption); 

    // $body.append('<img src="https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=images&format=json&titles="'+ct+'"/>');
    

    /*************NewYork Times Articles****************/
    var api_key="FPG1061kH7wjRbe5OTvOXrxxnFfjSpGS";
    var nyurl="https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+ct+"&sort=newest&api-key="+api_key;
    $.getJSON(nyurl,function(data){
        article=data.response.docs;
        if(article.length!=0)
        {
            $nytHeaderElem.text("New York Times Articles on "+ct);
            for (var i = 0; i < article.length; i++) {
                articleUrl=article[i].web_url;
                articleHeadline=article[i].headline.main;
                pubDateString=article[i].pub_date;
                pubDate=pubDateString.split("T")[0];
                snippet=article[i].snippet;
                $nytElem.append('<li class="articles container"><a class="article-url" target="_blank" href="'+articleUrl+'style="font-size:18px;margin-bottom:5px;"><b>'+articleHeadline+'</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ddd;">'+pubDate+'</span><p class="article_snippet">'+snippet+
                    '</p></li>');
            }
        }
        else{

            $nytHeaderElem.text("Sorry, No Articles could be found! ");
        }
    })
    .fail(function(e){
        $nytHeaderElem.text("Error! New York Times Articles could not be loaded. ");
        }
    );


    /*************WikiPedia Articles****************/
    var wikiurl="https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="+ct+"&origin=*&callback=";
    // var wikiurl= "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search="+ct+"&limit=10&callback=";
    var tm=setTimeout(function(){$wikih.text("Sorry an error occured and Wiki Articles can't be fetched right now!");},8000);
    $.ajax({
        url:wikiurl,
        dataType:"jsonp",
        success:function(data){
            //data=JSON.stringify(data);
            $wikih.text("Wikipedia articles on "+ct);
            articles=data["query"]["search"];
            // articles=data[1];
            if(articles.length!=0){
                count=0;
                for(var i=0;i<articles.length;i++){
                    atitle=articles[i]["title"];
                    // atitle=data[1][i];
                    adate=articles[i]["timestamp"].slice(0,10);
                    atime=articles[i]["timestamp"].slice(11,-1);
                    alink=atitle.replace(" ","_");
                    asnippet=articles[i]["snippet"];
                    // alink=data[3][i];
                    // asnippet=data[2][i];
                    // adate="2019-02-02";
                    count=count+1;
                    alist.push(atitle);
                    aclass=articles[i].pageid;
                    $wikiElem.append("<li class='container'><figure class='thumbnail"+count+" "+aclass+"'><img id='thumb' alt='Wiki Thumbnail' src='"+athumb+"'/><figcaption>"+acaption+"</figcaption></figure><a target='_blank' style='font-size:18px;' href='https://en.wikipedia.org/wiki/"+alink+"'><b>"+atitle+"</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style='color: #ddd;'>"+adate+"</span><br/><br/>"+asnippet+"<br/><br/></li>");

                }
                loadImage(alist);
            }
            else{
                $wikih.text("Sorry, No Articles could be found! ");
            }
            
            clearTimeout(tm);
        }
    });


    function loadImage(alist){
        alist=alist.join("|");
        athumb="static/travelbg.jpg";
        acaption="Figure Caption";
        athumburl="https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages%7Cpageterms&titles="+alist+"&piprop=thumbnail&pithumbsize=239&wbptterms=description&origin=*"
        // athumburl="https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=239&pilimit=10&wbptterms=description&gpssearch="+ct+"&gpslimit=20&origin=*";
        $.getJSON(athumburl,function(data){
            athumb1=data.query.pages;
            if(athumb1.length!=0){
                count=0;
                for(i=0;i<athumb1.length;i++){
                    athumb=athumb1[i].thumbnail;
                    count=count+1;
                    if(athumb!=undefined){
                        athumb=athumb.source;
                        athumbt=data.query.pages[i].pageid;
                        if(data.query.pages[i].terms!=undefined){
                            acaption=data.query.pages[i].terms.description;
                        }
                        else{
                            acaption="Figure Caption";
                        }
                        
                        
                    }
                    else{
                        athumb="static/travelbg.jpg";
                        acaption="Figure Caption";
                        athumbt=-1;
                    }
                    $("."+athumbt+" img").attr("src",athumb);
                    $("."+athumbt+" figcaption").text(acaption);
                }
                // athumb=athumb.source;
                // acaption=data.query.pages[0].terms.description;
                
            }
            else{
                athumb="static/travelbg.jpg";
                acaption="Figure Caption";
            }
            
        })
        .fail(function(e){
            athumb="static/travelbg.jpg";
            acaption="Figure Caption";
        });
    }

    
    
/************************* Thumbnail loading using direct APi request (deprecated) ************************/
    

    // //var purl="https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=images&format=json&titles="+ct;
    // var purl="https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=pageimages&titles="+ct;
    // $.getJSON(purl,function(data){
    //     console.log(data);
    //     // var pages = data.query.pages;
    //     // if(pages.length!=0){
    //     //     for (var page in pages) {
    //     //         for (var img of pages[page].images) {
    //     //             img1=img.title.split(" ");
    //     //             img1=img1.join("_");
    //     //             console.log("https://en.wikipedia.org/wiki/"+ct+"#/media/"+img1);
    //     //         }
    //     //     }
    //     // }
    //     // else{
    //     //     console.log("Sorry no images found!");
    //     // }
        
    // })
    // .fail(function(e){
    //     console.log("Sorry no images could be fetched!");
    // });


    return false;
};
// load streetview

$('#form-container').submit(loadData);

// loadData();
