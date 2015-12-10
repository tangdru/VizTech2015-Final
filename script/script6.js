/**
 * Created by tangdru on 12/4/15.
 */

var margin = {t:50,r:50,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var plot2 = d3.select('#plot-2')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Import
queue()
    .defer(d3.csv,'data/nobelPrizes.csv',parse)
    .defer(d3.csv,'data/nobelPeace.csv',parse)
    .await(dataLoaded);


//Generator
var lineGenerator = d3.svg.line()
    .x(function(d){ return scaleX(d.yr)})
    .y(function(d){ return scaleY(d.mdlcnt*1.25)})//scaleY(total value of year from country
    //.y(function(d){return scaleY(function(d)return d.yr;})
    // .rollup d3.sum(d, function(g){return g.values;});
    .interpolate('bundle');



//Scales
var scaleX = d3.scale.linear().domain([1880,2015]).range([0,width *.6]),
    scaleY = d3.scale.linear().domain([0,100]).range([height,0]);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function dataLoaded(err,country,peace) {

    var nestedData = d3.nest()
        .key(function (d) {
            return d.ctry})
        .entries(country);
    console.log(nestedData);

    nestedData.forEach(function (each) {
        count = d3.sum(each.values, function(d){return d.mdlcnt;})
        each.total_count = count;
    })

   /* var nestedDataPeace = d3.nest()
        .key(function (d){
            return d.ctry
        })
        .entries(peace);
    console.log(nestedDataPeace);*/



    var value = "ugh-only shows my index number";
    var series = plot
        .data(country)
        .append('g')
        .attr('class','countries')

    series.selectAll('country')
        .data(d3.keys(nestedData))
        .enter()
        .append('path')
        .attr('d', function(d){
            //console.log(d);
            return lineGenerator(nestedData[d].values)})
        .attr('class','line')
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4500)/height+')';
        })
        //.call(attachTooltip);
        .on('mouseover',function(d){
            console.log(d)
            //value = shoud updare from the map and puts the name ;
            div.transition()
                .duration(10)
                .style("opacity",.9)

            div.html('<p>' + value + '</p>')
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(400)
                .style("opacity", 0)

        });


    series.selectAll('country')
        .data(d3.keys(nestedData))
        .enter()
        .append('text')
        .text(function(d){
            return nestedData[d].key})
        .attr('x', 0)
        .attr('y', 500)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4500)/height+')';
        });

    /*series.selectAll('country')
        .data(d3.keys(nestedData))
        .enter()
        .append('circle')
        .attr('cx', function(d){
            return nestedData[d].yr})
        .attr('cy', function(d){
            return nestedData[d].mdlcnt})
        .attr('r', 8)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        })
        .call(attachTooltip);*/


}

/*function attachTooltip(selection){
    selection
        .on('mouseenter',function(d){
            var tooltip = d3.selectAll('.custom-tooltip>p>span');
            console.log(tooltip)


            tooltip
                .transition()
                .style('opacity',1);


            console.log(d3.select(tooltip[0][0]))
            d3.select(tooltip[0][0]).html(d.prize);
            tooltip.select('#Name').html(d.nameFirst);

        })

        .on('mousemove',function(){
            var xy = d3.mouse(plot.node());

            var tooltip = d3.select('.custom-tooltip');

            tooltip
                .style('left',(xy[0]+10)+'px')
                .style('top',(xy[1]+10)+'px');
        })
        .on('mouseleave',function(){
            d3.select('.custom-tooltip')
                .transition()
                .style('opacity',1);
        })
}*/




function parse(d){
    return {
        yr:d['year']!='..'?d['year']:undefined,
        prize: d['prize']!='..'?d['prize']:undefined,
        ctry: d['country']!='..'?d['country']:undefined,
        gdr: d['gender']!='..'?d['gender']:undefined,
        mdlcnt:+d['medalCount']!='..'?+d['medalCount']:0,
        nameFirst:d['firstName']!='..'?d['firstName']:undefined,
        nameLast:d['lastName']!='..'?d['lastName']:undefined,
        afltn: d['affilation']!='..'?d['affilation']:undefined,
    }
}

function parseMetadata(d){
};

