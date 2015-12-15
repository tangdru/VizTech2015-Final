/**
 * Created by tangdru on 12/15/15.
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
    .defer(d3.csv,'data/nobelPrizes_cleaned.csv',parseCountry)
    .defer(d3.csv,'data/countryMetadata.csv',parseCountryMetadata)
    .defer(d3.csv,'data/yearMetadata.csv',parseYearMetadata)
    .await(dataLoaded);



function dataLoaded(err,dataset,countryMetadata,yearMetadata) {

    var scaleX = d3.scale.linear().domain([1900,2015]).range([0,width*.6]),
        scaleY = d3.scale.linear().domain([0,100]).range([height,0]);
    var lineGenerator = d3.svg.line()
        .interpolate('basis');
    var years = d3.range(1900,2016,1); //See: https://github.com/mbostock/d3/wiki/Arrays#d3_range
    console.log(years);


    var nestedData = d3.nest()
        .key(function (d) {
            return d.ctry
        })
        .key(function (d) {
            return d.yr
        })
        .rollup(function (leaves) {
            return {
                prizes: leaves,
                total: leaves.length
            }
        })
        .entries(dataset);


    var ctryLines = plot.selectAll('.country')
        .data(nestedData,function(d){return d.key})
        .enter()
        .append('path')
        .attr('class','country') //this results in 57 <path> elements
        .each(function(d){
            //console.log(d); //just so you see what the data looks like
        })
        .style('fill','none')
        .style('stroke','black')
        .attr('transform', function(d,i){
            return 'translate('+(i*5000)/width+ ','+(i*-4000)/height+')';
        });

    ctryLines.attr('d', function(d,i){
        //"this" --> the individual <path> elements
        //"d" --> data object bound to the <path>
        //d.values --> array of years and prizes, by country
        //"i" --> index; use this to offset the <path>

        var prizes = d3.map(d.values, function(d){return d.key});

        lineGenerator
            .x(function(el){
                //!!!!!!!!!!!!!!!Here is the important part!!!!!!!!!!!
                //el --> a number, ranging from 1900 to 2015
                return scaleX(el)
            })
            .y(function(el){
                //again, el --> a number ranging from 1900 to 2015
                //we use that number to look up the corresponding prizes for that year, if any
                if(!prizes.get(el)) return 0;
                return (prizes.get(el)).values.total*-5 ;
            })

        return lineGenerator(years);

    })
}





function parseCountry(d){return {
    yr:+d['year']!='..'?+d['year']:undefined,
    ctry: d['country']!='..'?d['country']:undefined,
    prizeName: d['prize']!='..'?d['prize']:undefined,
    name:d['name']!='..'?d['name']:undefined
}
}

function parseCountryMetadata(d){
    return {
        ctry: d.country,
        index: d.index
    }
}


function parseYearMetadata(d){
    return {
        year: d.year,
        index: d.index
    }
}