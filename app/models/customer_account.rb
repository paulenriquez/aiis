class CustomerAccount < ApplicationRecord
    has_many :purchase_orders
    has_many :customer_payments
end
