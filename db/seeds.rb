# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

## Products
products_list = [
    ['Polar 90, 92 SD', 'Guillotine Knife', 'Standard - 43 1/8" x 4 1/2" x 15/32", 1095 x 115 x 11.7 mm', 16278.00],
    ['Polar 90, 92 SD2', 'Guillotine Knife', 'Standard, 2 Rows - 43 1/8" x 4 1/2" x 15/32", 1095 x 115 x 11.7 mm', 18394.00],
    ['Polar 90, 92 HSS', 'Guillotine Knife', 'HSS 18% Tungsten - 43 1/8" x 4 1/2" x 15/32", 1095 x 115 x 11.7 mm', 18900.00],
    ['Polar 90, 92 HSS2', 'Guillotine Knife', 'HSS 18% Tungsten, 2 Rows - 43 1/8" x 4 1/2" x 15/32", 1095 x 115 x 11.7 mm', 19394.00],
    ['Polar 115, 112, 110, 107 SD', 'Guillotine Knife', 'Standard - 54 3/4" x 6 1/4" x 17/32", 1390 x 160 x13.7 mm', 24250.00],
    ['Polar 115, 112, 110, 107 HSS', 'Guillotine Knife', 'HSS 18% Tungsten - 54 3/4" x 6 1/4" x 17/32", 1390 x 160 x13.7 mm', 25575.00],
    ['Polar 137 SD', 'Guillotine Knife', 'Standard - 63" x 6 1/4" x 17/32", 1605 x 160 x 13.7 mm', 24190.00],
    ['Polar 137 HSS', 'Guillotine Knife', 'HSS 18% Tungsten - 63" x 6 1/4" x 17/32", 1605 x 160 x 13.7 mm', 29550.00],
    ['Polar 140, 150, 155 SD', 'Guillotine Knife', 'Standard 68" x 6 1/4" x 17/32", 1735 x 160 x 13.7 mm', 28800.00],
    ['Schneider 92 HSS', 'Guillotine Knife', 'HSS 18% Tungsten - 43" x 5 3/16" x 13/32", 1090 x 132 x 10 mm', 16650.00],
    ['Schneider 115, 112, 110, 106 SD', 'Guillotine Knife', 'Standard - 53 1/2" x 5 11/16" x 13/32", 1350 x 144 x 10 mm', 19342.00],
    ['Schneider 132 SD', 'Guillotine Knife', 'Standard - 61" x 5 3/4" x 15/32", 1566 x 145 x 12 mm', 21875.00],
    ['Wohlenberg 115, 112, 107 SD', 'Guillotine Knife', 'Standard - 54 1/2" x 5" x 15/32", 1380 x 125 x 12 mm', 17532.00],
    ['Wohlenberg A132S, A132T SD', 'Guillotine Knife', 'Standard - 62" x 5 1/2" x 17/32", 1570 x 140 x 13.7 mm', 24190.00],
    ['Perfecta 115, 112, 107 SD', 'Guillotine Knife', 'Standard - 53 1/2" x 5 1/2" x 15/32", 1350 x 140 x 12 mm', 17141.00],
    ['Perfecta 115, 112, 107 HSS', 'Guillotine Knife', 'HSS 18% Tungsten - 53 1/2" x 5 1/2" x 15/32", 1350 x 140 x 12 mm', 21800.00],
    ['Como, Seybold, Pivano, Diamond (CSPD) Atlas 36", 42" SD', 'Guillotine Knife', 'Standard Blank No Holes - 52" x 5" x 1/2", 1320 x 127 x 12.7 mm', 17572.00],
    ['Como, Seybold, Pivano, Diamond (CSPD) Atlas 45" SD', 'Guillotine Knife', 'Standard Blank No Holes - 59" x 5" x 1/2", 1500 x 127 x 12.7 mm', 20092.00]
]

products_list.each do |name, type, specs, unit_price|
    Product.create(product_name: name, product_type: type, product_specs: specs, unit_price: unit_price, description: nil)
end