#!/usr/bin/env ruby 
require 'json'
cities = {}
city = nil
key = nil
File.foreach('cities.txt') { |s| 
  if s =~ /^lat:/ 
    # cities.push city if city 
    cities[key] = city if city 
    city = {}
  end 
  if s =~ /^(lat|lon): "(.*)"/
    field = $1
    $2 =~ /(-)?(\d+).*?(\d+)/
    deg = $2.to_f + $3.to_f/60
    deg = -deg if $1=='-'
    city[field] = format("%.3f", deg).to_f 
  elsif s =~ /^city_wiki: "(.*)"/ 
    city['wikipedia'] = $1
    city['city'] = $1.gsub(/,.+/,'').gsub('_',' ')
    # remove whitespace and modifier suffixes like (city)
    key = city['city'].downcase.gsub(/[ -]/,'').gsub(/\(.*?\)/,'')
  end
}
# puts "citiesCallback(#{cities.to_json});"
puts "citiesCallback(#{JSON.pretty_generate(cities)});"
