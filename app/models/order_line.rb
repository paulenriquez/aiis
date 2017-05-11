class OrderLine < ApplicationRecord
    belongs_to :purchase_order
    belongs_to :product
    has_many :inventory_histories, dependent: :destroy
end
