class InventoryHistory < ApplicationRecord
    belongs_to :product
    belongs_to :order_line, optional: true
end
