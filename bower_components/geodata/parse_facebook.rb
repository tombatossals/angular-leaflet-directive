#!/usr/bin/env ruby 
# encoding: utf-8

require "net/http"
require "uri"
require 'json'

CITIES_UNESCAPED = ["Adak", "Nukuʻalofa", "Apia", "Pago Pago", "Alofi", "Avarua", "Honolulu", "Hilo", "Anchorage", "Papeete", "Fairbanks", "Sitka", "Whitehorse", "Juneau", "Adamstown", "Vancouver", "Rabi Island", "Portland", "San Francisco", "Seattle", "Sacramento", "Los Angeles", "Riverside", "San Diego", "Tijuana", "Mexicali", "Las Vegas", "Yellowknife", "Calgary", "Edmonton", "Phoenix", "Salt Lake City", "Tucson", "Hanga Roa", "Saskatoon", "Albuquerque", "El Paso", "Chihuahua", "Denver", "Durango", "Regina", "Zapopan", "Guadalajara", "Monterrey", "Mexico City", "San Antonio", "Puebla", "Austin", "Oklahoma City", "Wichita", "Winnipeg", "Dallas", "Veracruz", "Houston", "Kansas City", "Minneapolis", "Quetzaltenango", "Guatemala City", "St. Louis", "New Orleans", "Memphis", "Mérida", "San Salvador", "Belmopan", "Belize City", "Milwaukee", "Chicago", "Tegucigalpa", "Nashville", "Managua", "Indianapolis", "Louisville", "Cincinnati", "Atlanta", "San José", "Detroit", "Columbus", "Tampa", "Havana", "Cleveland", "Jacksonville", "George Town", "Charlotte", "Miami", "Pittsburgh", "Guayaquil", "Panama City", "Toronto", "Buffalo", "Raleigh", "Quito", "Rochester", "Nassau", "Washington", "Lima", "Kingston", "Baltimore", "Cali", "Virginia Beach", "Santiago de Cuba", "Ottawa", "Medellín", "Cartagena", "Philadelphia", "Barranquilla", "Forked River", "Jersey City", "Bogotá", "New York City", "Montreal", "Iquitos", "Valdivia", "Concepción", "Port-au-Prince", "Cusco", "Maracaibo", "Valparaíso", "Arequipa", "Providence", "San Carlos de Bariloche", "La Serena", "Quebec City", "Cockburn Town", "Boston", "Punta Arenas", "Santiago", "Antofagasta", "Iquique", "Oranjestad", "Santo Domingo", "Rio Branco", "Willemstad", "Calama", "Mendoza", "Iqaluit", "Ushuaia", "La Paz", "Puerto Williams", "Caracas", "Fredericton", "San Juan", "Saint John", "Sucre", "Charlotte Amalie", "Hamilton", "Road Town", "Córdoba", "Porto Velho", "City of Halifax", "Santa Cruz de la Sierra", "Charlottetown", "The Valley", "Basse-Terre", "Bahía Blanca", "St. John's", "St. George's", "Port of Spain", "San Fernando", "Roseau", "Chaguanas", "Kingstown", "Fort-de-France", "Castries", "Rosario", "Boa Vista", "Manaus", "Bridgetown", "Buenos Aires", "Stanley", "Asunción", "Saint-Pierre", "Montevideo", "Cuiabá", "Paramaribo", "Campo Grande", "Ciudad del Este", "Chuí", "Pelotas", "Cayenne", "Nuuk", "Porto Alegre", "Macapá", "Assis", "Curitiba", "Belém", "Brasília", "Campinas", "São Paulo", "São José dos Campos", "Rio de Janeiro", "Vitória", "Ilhéus", "Fortaleza", "Maceió", "Recife", "Horta (Azores)", "Angra do Heroísmo", "Ponta Delgada", "Praia", "Reykjavík", "Dakar", "Thiès", "Serekunda", "Brikama", "Banjul", "Santa Cruz de Tenerife", "Nouakchott", "Bissau", "Las Palmas de Gran Canaria", "Conakry", "Freetown", "El Aaiún", "Monrovia", "Lisbon", "Porto", "Cork (city)", "Marrakech", "Bamako", "Casablanca", "Koulikoro", "Rabat", "Tórshavn", "Dublin", "Seville", "Belfast", "Jamestown", "Gibraltar", "Yamoussoukro", "Douglas", "Málaga", "Glasgow", "Abidjan", "Madrid", "Cardiff", "Edinburgh", "Timbuktu", "Liverpool", "Bilbao", "Manchester", "Aberdeen", "Birmingham", "Leeds", "Nantes", "Ouagadougou", "Tamale", "Valencia", "Accra", "London", "Greenwich", "Lomé", "Toulouse", "Andorra la Vella", "Ibiza", "Niamey", "Barcelona", "Paris", "Cotonou", "Porto-Novo", "Palma", "Algiers", "Lagos", "Ibadan", "The Hague", "Brussels", "Antwerp", "Rotterdam", "Lyon", "Amsterdam", "Marseille", "Bergen", "Luxembourg (city)", "Geneva", "São Tomé", "Düsseldorf", "Cologne", "Cannes", "Nice", "Monaco", "Bern", "Abuja", "Enugu", "Turin", "Strasbourg", "Kano", "Zürich", "Frankfurt", "Malabo", "Stuttgart", "Milan", "Libreville", "Vaduz", "Douala", "Hanover", "Hamburg", "Tunis", "Aarhus", "Oslo", "Innsbruck", "Yaoundé", "Munich", "Gothenburg", "Leipzig", "City of San Marino", "Vatican City", "Rome", "Copenhagen", "Malmö", "Salzburg", "Tripoli", "Luanda", "Berlin", "Dresden", "Naples", "Linz", "Prague", "Sabha", "Birkirkara", "Ljubljana", "Valletta", "N'Djamena", "Brazzaville", "Kinshasa", "Graz", "Longyearbyen", "Zagreb", "Vienna", "Split (city)", "Bratislava", "Stockholm", "Sarajevo", "Cape Town", "Bangui", "Gdańsk", "Budapest", "Podgorica", "Tirana", "Kraków", "Belgrade", "Kaliningrad", "Warsaw", "Pristina", "Skopje", "Thessaloniki", "Sofia", "Athens", "Tampere", "Lviv", "Riga", "Espoo", "Tallinn", "Helsinki", "Vilnius", "Port Elizabeth", "Livingstone", "Gaborone", "Bucharest", "Bloemfontein", "Tartu", "İzmir", "Lubumbashi", "Maseru", "Francistown", "Minsk", "Johannesburg", "Pretoria", "Lusaka", "Ndola", "Bulawayo", "Chişinău", "Istanbul", "Bursa", "Bujumbura", "Tiraspol", "Alexandria", "Kigali", "Saint Petersburg", "Kiev", "Odessa", "Harare", "Durban", "Mbabane", "Lobamba", "Cairo", "Manzini", "Port Said", "Konya", "Omdurman", "Khartoum", "Suez", "Maputo", "Luxor", "Ankara", "Mwanza", "Murmansk", "Nicosia", "Lilongwe", "Simferopol", "Gaza", "Mersin", "Tel Aviv", "Blantyre", "Jerusalem", "Adana", "Beirut", "Dodoma", "Amman", "Damascus", "Kharkiv", "Nairobi", "Gaziantep", "Moscow", "Addis Ababa", "Asmara", "Jeddah", "Zanzibar City", "Dar es Salaam", "Medina", "Mecca", "Sukhumi", "Djibouti (city)", "Moroni", "Tskhinvali", "Sana'a", "Baghdad", "Nizhny Novgorod", "Hargeisa", "Arbil", "Yerevan", "Tbilisi", "Mamoudzou", "Mogadishu", "Tabriz", "Riyadh", "Stepanakert", "Antananarivo", "Basra", "Kuwait City", "Baku", "Dammam", "Samara", "Manama", "Tehran", "Doha", "Abu Dhabi", "Dubai", "Victoria", "Saint-Denis", "Perm", "Port Louis", "Ashgabat", "Muscat", "Nukus", "Mashhad", "Yekaterinburg", "Kandahar", "Karachi", "Hyderabad", "Dushanbe", "Kabul", "Tashkent", "Astana", "Multan", "Peshawar", "Namangan", "Ahmedabad", "Mumbai", "Surat", "Faisalabad", "Rawalpindi", "Islamabad", "Omsk", "Malé", "Pune", "Lahore", "Bishkek", "Srinagar", "Amritsar", "Jaipur", "Ludhiana", "Almaty", "New Delhi", "Bangalore", "Nagpur", "Colombo", "Sri Jayawardenapura-Kotte", "Chennai", "Kanpur", "Kandy", "Lucknow", "Batticaloa", "Novosibirsk", "Patna", "Kathmandu", "Ürümqi", "Norilsk", "Kolkata", "Gangtok", "Shigatse", "Thimphu", "Dhaka", "Lhasa", "Agartala", "Guwahati", "Chittagong", "Shillong", "Port Blair", "Dibrugarh", "Banda Aceh", "Naypyidaw", "Yangon", "Medan", "Phuket (city)", "Chiang Mai", "Surat Thani", "Padang", "Alor Star", "Hat Yai", "Bangkok", "Pattaya", "Ipoh", "Pekanbaru", "Bratsk", "Kuala Lumpur", "Xining", "Nakhon Ratchasima", "Kota Bharu", "Malacca Town", "Vientiane", "Kunming", "Udon Thani", "Johor Bahru", "Lanzhou", "Singapore", "Siem Reap", "Chengdu", "Palembang", "Phnom Penh", "Hanoi", "Chongqing", "Hai Phong", "Ho Chi Minh City", "Jakarta", "Bogor", "Ulan Bator", "Bandung", "Huế", "Da Nang", "Nanning", "Xi'an", "Pontianak", "Kuching", "Yogyakarta (city)", "Semarang", "Taiyuan", "Malang", "Surabaya", "Guangzhou", "Macau", "Zhengzhou", "Dongguan", "Miri", "Shenzhen", "Hong Kong", "Wuhan", "Handan", "Shijiazhuang", "Bandar Seri Begawan", "Denpasar", "Mandurah", "Perth", "Kota Kinabalu", "Beijing", "Balikpapan", "Jinan", "Tianjin", "Port Hedland", "Nanjing", "Makassar", "Hangzhou", "Kaohsiung", "Qingdao", "Taichung", "Manila", "Quezon City", "Makati City", "Shanghai", "Taipei", "Dalian", "Iloilo City", "Zamboanga City", "Shenyang", "Tagbilaran", "Cebu City", "Changchun", "Dili", "Pyongyang", "Davao City", "Kaesong", "Harbin", "Incheon", "Seoul", "Wonsan", "Okinawa", "Ambon", "Daegu", "Busan", "Yakutsk", "Chongjin", "Fukuoka", "Darwin", "Vladivostok", "Hiroshima", "Koror", "Melekeok", "Kobe", "Osaka", "Kyoto", "Nagoya", "Adelaide", "Yokohama", "Kawasaki", "Tokyo", "Jayapura", "Sapporo", "Geelong", "Hagåtña", "Dededo", "Melbourne", "Saipan", "Cairns", "Townsville", "Port Moresby", "Hobart", "Canberra", "Rockhampton", "Magadan", "Wollongong", "Sydney", "Newcastle", "Weno", "Brisbane", "Gold Coast", "Palikir", "Petropavlovsk-Kamchatsky", "Honiara", "Nouméa", "Yaren District", "Port Vila", "Invercargill", "Dunedin", "Majuro", "Christchurch", "South Tarawa", "Wellington", "Auckland", "Mata-Utu", "Anadyr (town)", "Suva", "Funafuti", "Labasa", "Nukulaelae"]
MATCHED = []
UNMATCHED = []

CITIES_UNESCAPED.each do |city_name|

  # get JSON
  url = URI.parse("https://graph.facebook.com/search?q=" + URI.encode(city_name) + "&type=adcity&limit=3")
  req = Net::HTTP::Get.new url.request_uri
  res = Net::HTTP.start(url.host, url.port, 
          :use_ssl => url.scheme == 'https') {|http| http.request req}
  result = JSON.parse( res.body )["data"]

  # look for country
  found_country = false
  result.each do |city|
    
    if city['name'].include? "#{city_name}"
      if city['subtext'].index( ", ")
        country = city['subtext'].split(", ")[1]
      else
        country = city['subtext']
      end

      puts "#{city_name} is in #{country}"

      MATCHED << { city: city_name, country: country}
      found_country = true
      break
    end
  end

  UNMATCHED << { city: city_name, data: result} unless found_country
end

File.open("matched.json","w") do |f|
  f.write(MATCHED.to_json)
end

File.open("unmatched.json","w") do |f|
  f.write(UNMATCHED.to_json)
end
