class Product < ApplicationRecord
    has_many :purchase_orders, through: :order_lines
    has_many :inventory_histories
end
