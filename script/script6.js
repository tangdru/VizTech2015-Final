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
    .y(function(d){ return scaleY(d.mdlcnt*2)})//scaleY(total value of year from country
    //.y(function(d){return scaleY(function(d)return d.yr;})
    // .rollup d3.sum(d, function(g){return g.values;});
    .interpolate('bundle');



//Scales
var scaleX = d3.scale.linear().domain([1880,2015]).range([0,width *.6]),
    scaleY = d3.scale.linear().domain([0,100]).range([height,0]);



function dataLoaded(err,country,peace) {

    var nestedData = d3.nest()
        .key(function (d) {
            return d.ctry})
        .entries(country);

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


    //d3.selectAll('.btn-peace').on('click', function(){ draw(filterPeace);})

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
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        });

    series.selectAll('country')
        .data(d3.keys(nestedData))
        .enter()
        .append('text')
        .text(function(d){
            return nestedData[d].key})
        .attr('x', 0)
        .attr('y', 480)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        });


    var nestedDataPeace = d3.nest()
        .key(function (d) {
            return d.ctry})
        .entries(peace);


    var peace = plot2
        .data(peace)
        .append('g')
        .attr('class','countries')

    peace.selectAll('country')
        .data(d3.keys(nestedDataPeace))
        .enter()
        .append('path')
        .attr('d', function(d){
            //console.log(d);
            return lineGenerator(nestedDataPeace[d].values)})
        .attr('class','line')
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        });

    peace.selectAll('country')
        .data(d3.keys(nestedDataPeace))
        .enter()
        .append('text')
        .text(function(d){
            return nestedDataPeace[d].key})
        .attr('x', 0)
        .attr('y', 480)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        })

    ;



}

/*function dataLoaded(err,peace,metadata) {

    var nestedData = d3.nest()
        .key(function (d) {
            return d.ctry})
        .entries(peace);

    nestedData.forEach(function (each) {
        count = d3.sum(each.values, function(d){return d.mdlcnt;})
        each.total_count = count;
    })

    console.log(nestedData);


    //d3.selectAll('.btn-peace').on('click', function(){ draw(filterPeace);})

    var series = plot
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
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        });

    series.selectAll('country')
        .data(d3.keys(nestedData))
        .enter()
        .append('text')
        .text(function(d){
            return nestedData[d].key})
        .attr('x', 0)
        .attr('y', 480)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        })

    ;

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

