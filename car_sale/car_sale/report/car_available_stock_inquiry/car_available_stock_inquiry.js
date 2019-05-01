// Copyright (c) 2016, GreyCube Technologies and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Car Available Stock Inquiry"] = {
	"filters": [
		{
            "fieldname": "item_group",
            "label": __("Group"),
            "fieldtype": "Select"
        },
        {
            "fieldname": "brand",
            "label": __("Brand"),
            "fieldtype": "Select"
        },
        {
            "fieldname": "Category",
            "label": __("Category"),
            "fieldtype": "Select"
		},
        {
            "fieldname": "Color",
            "label": __("Color"),
            "fieldtype": "Select"
        },
        {
            "fieldname": "model",
            "label": __("Model"),
            "fieldtype": "Select"
        }
	],

    "onload": function (report) {
        function filtered(data, attribute_name) {
            let filtered = [];
            filtered = data.filter(e => e.attribute.localeCompare(attribute_name) == 0);
            return filtered
        }
        function get_only_attribute_value(filtered, only_attribute_value) {
            for (var i = 0; i < filtered.length; i++) {
                only_attribute_value.push(filtered[i].attribute_value);
            }
            return only_attribute_value
        }
        function set_value_in_dropdown(attribute_name, data,default_value) {
			filtered_attribute = filtered(data, attribute_name)
            let only_attribute_value = []
			only_attribute_value = get_only_attribute_value(filtered_attribute, only_attribute_value)
            var attribute = frappe.query_report.get_filter(attribute_name);
            // let default_value='Select '+ attribute_name.charAt(0).toUpperCase() + attribute_name.slice(1)+'..'
            only_attribute_value.unshift(__(default_value))
			attribute.df.options = only_attribute_value;
            attribute.df.default = only_attribute_value[0];
            attribute.refresh();
            attribute.set_input(attribute.df.default);
        }
        function set_value_in_brand(attribute_name,data,default_value) {
            var attribute = frappe.query_report.get_filter(attribute_name);
            data.unshift(default_value)
            attribute.df.options = data;
            attribute.df.default = data[0];
            attribute.refresh();
            attribute.set_input(attribute.df.default);
        }
        report.page.add_inner_button(__("Clear Filters"), function() {
            frappe.query_report.set_filter_value('item_group','اختر المجموعة')
            frappe.query_report.set_filter_value('brand','اختر النوع')
            frappe.query_report.set_filter_value('Category', 'اختر الفئة')
            frappe.query_report.set_filter_value('Color', 'اختر اللون')
            frappe.query_report.set_filter_value('model','اختر الموديل')
            
        });
        
        return frappe.call({
            method: "car_sale.api.get_distinct_attributes_values",
            args: {},
            async:true,
            callback: function (r) {
                if (r.message) {
                    let data = [];
                    data = r.message
                    attribute_name = 'Color'
                    default_value='اختر اللون'
                    set_value_in_dropdown(attribute_name, data,default_value)
                    attribute_name = 'Category'
                    default_value='اختر الفئة'
                    set_value_in_dropdown(attribute_name, data,default_value)
                    attribute_name = 'model'
                    default_value='اختر الموديل'
                    set_value_in_dropdown(attribute_name, data,default_value)
                    return frappe.call({
                        method: "car_sale.api.get_template_name",
                        args: {
                            "search_group": "All Item Groups"
                        },
                        async:true,
                        callback: function (r) {
                            if (r.message) {
                                let data = [];
                                data = r.message;
								let attribute_name = 'brand'
								let default_value='اختر النوع'
								set_value_in_brand(attribute_name, data,default_value)
								return frappe.call({
									method: "car_sale.api.get_item_group",
									args: {
										
									},
									async:true,
									callback: function (r) {
										if (r.message) {
											let data = [];
											data = r.message;
											let attribute_name = 'item_group'
											let default_value='اختر المجموعة'
											set_value_in_brand(attribute_name, data,default_value)
										}
									}
								});								

                            }
                        }
                    });
                }
            }
        });
    }
}
