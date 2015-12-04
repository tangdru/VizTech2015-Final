
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
    .defer(d3.csv,'data/metadataHemisphere.csv',parseMetadata)
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


function dataLoaded(err,country,metadata) {

    var nestedData = d3.nest()
        .key(function (d) {
            return d.ctry
        })

        .entries(country);


    /*nestedData.forEach(function (each) {
     count = d3.sum(each.values, function(d){return d.mdlcnt;})
     each.total_count = count;
     })*/

    console.log(nestedData);



    /*var filterPeace = nestedData.map(function(eachCountry){ //pass this through a function that will filter by 'what i want'
     return eachCountry.values.filter(function(d) {
     return d.prize == 'Peace';})
     }
     )*/
    var filterPeace = nestedData.map(function(eachCountry){
            return {
                key:eachCountry.key,
                values:eachCountry.values.filter(function(d) {return d.prize == 'Peace';})
            }
        }
    )
    console.log("Peace", filterPeace);

    /*var nodes = plot.selectAll('.countryLines')
        .datum(d3.keys(nestedData))

    var nodesEnter = nodes.enter().append('g')
        .attr('class','countryLines')
        .attr('d', lineGenerator);

    nodesEnter.append('path')
        .attr('class','line')
        .attr('d', function(d){
            return lineGenerator(nestedData[d].values)})
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        })

    nodesEnter.append('text')
        .append('text')
        .text(function(d){
            return nestedData[d].key})
        .attr('x', 0)
        .attr('y', 480)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        })

    nodes.exit()
        .remove();*/




    plot.selectAll('.countryLines')
        .datum(d3.keys(nestedData))
        .transition()
        .attr('d', lineGenerator);

    var series = plot
        .append('g')
        .attr('class','countries')

    var lines = series.selectAll('country')
        .data(d3.keys(nestedData));
    var linesEnter = lines.enter()
        .append('path')
        .attr('class','line')
        .attr('d', function(d){
            return lineGenerator(nestedData[d].values)})
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        })

    lines.exit()
        .transition()
        .remove();

    var names = series.selectAll('names')
        .data(d3.keys(nestedData));
    var namesEnter = names.enter()
        .append('text')
        .text(function(d){
            return nestedData[d].key})
        .attr('x', 0)
        .attr('y', 480)
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        })

    names.exit()
        .transition()
        .remove();


}


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

