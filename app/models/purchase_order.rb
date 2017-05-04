class PurchaseOrder < ApplicationRecord
    has_many :order_lines, inverse_of: :purchase_order
    has_many :products, through: :order_lines
    has_many :customer_payments
    belongs_to :customer_account

    accepts_nested_attributes_for :order_lines

    private
        def complete_attributes
            
        end
        def get_status

        end
end