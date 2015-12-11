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
    .defer(d3.csv,'data/nobelPrizes_cleaned.csv',parse)
    .defer(d3.csv,'data/nobelPrizes_cleaned_separated.csv',parse)
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
    scaleX2 = d3.scale.linear().domain([1901,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,100]).range([height,0]);

//colorScales
var colorScale1

//tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//plot 2 stuffs
/*var xValue = function(d){
        return d.yr;},
    xScale = d3.scale.linear().range([0,width]),
    xMap = function(d) {
        return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient('bottom');

var yValue = function(d){
        return d['Country'];},
    yScale = d3.scale.linear().range([height,0]),
    yMap = function(d){
        return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient('left');

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);*/

var cValue = function(d){
        return d.prize;},
    color = d3.scale.category10();
//load data
    function dataLoaded(err,country,peace,cleaned) {

//nesting
    var nestedData1 = d3.nest()
            .key(function (d) {
                return d.ctry})
        .entries(country);
    console.log(nestedData1);

    nestedData1.forEach(function (each) {
        count = d3.sum(each.values, function(d){return d.mdlcnt;})
        each.total_count = count;
    })

    var nestedData2 = d3.nest()
        .key(function (d){return d.ctry})
        .key(function(d){return d.yr})
        .key(function (d){return d.prize})
        .entries(cleaned);
        console.log(nestedData2);



   /* var nestedDataPeace = d3.nest()
        .key(function (d){
            return d.ctry
        })
        .entries(peace);
    console.log(nestedDataPeace);*/



    var value = "ugh-only shows my index number";

//draw first plot
    var series = plot
        .data(country)
        .append('g')
        .attr('class','countries')

    series.selectAll('country')
        .data(d3.keys(nestedData1))
        .enter()
        .append('path')
        .attr('d', function(d){
            //console.log(d);
            return lineGenerator(nestedData1[d].values)})
        .attr('class','line')
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4500)/height+')';
        })
        //.call(attachTooltip);
        /*.on('mouseover',function(d){
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

        })*/
;


    series.selectAll('country')
        .data(d3.keys(nestedData1))
        .enter()
        .append('text')
        .text(function(d){
            return nestedData1[d].key})
        .attr('x', 0)
        .attr('y', 500)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4500)/height+')';
        });    var series = plot
        .data(country)
        .append('g')
        .attr('class','countries')

    series.selectAll('country')
        .data(d3.keys(nestedData1))
        .enter()
        .append('path')
        .attr('d', function(d){
            //console.log(d);
            return lineGenerator(nestedData1[d].values)})
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
        .data(d3.keys(nestedData1))
        .enter()
        .append('text')
        .text(function(d){
            return nestedData1[d].key})
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


//draw 2nd plot

        var chem = plot2
            .data(cleaned)
            .append('g')
            .attr('class','countries')

        chem.selectAll('country')
            .data(cleaned)
            .enter()
            .append('circle')
            .attr('cx', function(d){
                return scaleX2(d.yr);})
            .attr('cy',function(d){
                return scaleY(d.chem);
            })
            .style('r',3)
            .style('fill', 'red')
            .style('opacity',.25)
            .attr('transform', function(d,i){
                return 'translate('+(i*0)+','+(i*-500)/height+')';
            })

        ;

        var econ = plot2
            .data(cleaned)
            .append('g')
            .attr('class','countries')
        console.log(econ);

        econ.selectAll('country')
            .data(cleaned)
            .enter()
            .append('circle')
            .attr('cx', function(d){
                return scaleX2(d.yr);})
            .attr('cy',function(d){
                return scaleY(d.econ);
            })
            .style('r',3)
            .style('fill', 'blue')
            .style('opacity',.25)
            .attr('transform', function(d,i){
                return 'translate('+(i*0)+','+(i*-500)/height+')';
            })

        ;
        var lit = plot2
            .data(cleaned)
            .append('g')
            .attr('class','countries')

        lit.selectAll('country')
            .data(cleaned)
            .enter()
            .append('circle')
            .attr('cx', function(d){
                return scaleX2(d.yr);})
            .attr('cy',function(d){
                return scaleY(d.econ);
            })
            .style('r',3)
            .style('fill', 'green')
            .style('opacity',.25)
            .attr('transform', function(d,i){
                return 'translate('+(i*0)+','+(i*-500)/height+')';
            })

        ;


        /*plot2.selectAll('dots')
            .data(cleaned)
            .enter()
            .append('circle')
            .attr('cx', function(d){
                return d.yr})
            .attr('cy', function (d,i){
                return d.country})
            .attr('r', 4)
            .attr('fill', 'black');*/

        /*plot2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Years");

        // y-axis
        plot2.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Countries");


        plot2.selectAll(".dot")
            .data(nestedData2)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d["Winner"] + "<br/> (" + xValue(d)
                        + ", " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });*/








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
        yr:+d['year']!='..'?+d['year']:undefined,
        prize: +d['prize']!='..'?+d['prize']:undefined,
        prizecnt: +d['prize']!='..'?d['prize']:undefined,
        ctry: d['country']!='..'?d['country']:undefined,
        gdr: d['gender']!='..'?d['gender']:undefined,
        mdlcnt:+d['medalCount']!='..'?+d['medalCount']:0,
        nameFirst:d['firstName']!='..'?d['firstName']:undefined,
        nameLast:d['lastName']!='..'?d['lastName']:undefined,
        name:d['name']!='..'?d['name']:undefined,
        afltn: d['affilation']!='..'?d['affilation']:undefined,
        chem: +d['chem']!='..'?d['chem']:undefined,
        econ: +d['econ']!='..'?d['econ']:undefined,
        lit: +d['lit']!='..'?d['lit']:undefined
    }
}

function parseMetadata(d){
};

