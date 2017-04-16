class PurchaseOrder < ApplicationRecord
    has_many :products, through: :order_lines
    has_many :customer_payments
    belongs_to :customer_account
end
