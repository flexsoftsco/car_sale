//item template name
//--------------------------
frappe.call({
    method: "car_sale.api.get_template_name",
    callback: function (r) {
        if (r.message) {
            cur_frm.fields_dict.search_template.df.options = r.message;
            cur_frm.set_value('search_template', null);
            cur_frm.refresh_field("search_template")
        }
    }
})

frappe.ui.form.on('Sales Order', {
    sales_partner: function(frm) {
		frappe.call({
			method: "car_sale.api.get_branch_of_sales_partner",
			args: {
				'sales_partner': cur_frm.doc.sales_partner
			},
			callback: function(r) {
				if(r.message) {
					cur_frm.set_value('sales_partner_branch',r.message);
					cur_frm.refresh_fields('sales_partner_branch');
				}
			}
		})
	},
	items_on_form_rendered: function() {
			erpnext.setup_serial_no();
	},
	search_template: function(frm){
        frappe.call({
            method: "car_sale.api.get_category_name",
            args: { search_template: cur_frm.doc.search_template },
            callback: function (r) {
                if (r.message) {
                    cur_frm.fields_dict.search_category.df.options = r.message;
                    cur_frm.set_value('search_category', null);
                    cur_frm.refresh_field("search_category");

                    cur_frm.fields_dict.search_model.df.options =''
                    cur_frm.set_value('search_model', null);
                    cur_frm.refresh_field("search_model");

                    cur_frm.fields_dict.search_color.df.options=''
                    cur_frm.set_value('search_color', null);
                    cur_frm.refresh_field("search_color");
                    
                }

            }
        })
    },
    search_category: function(frm){
        frappe.call({
            method: "car_sale.api.get_model_name",
            args: { search_template: cur_frm.doc.search_template,
                search_category:cur_frm.doc.search_category
             },
            callback: function (r) {
                if (r.message){
                    cur_frm.fields_dict.search_model.df.options = r.message;
                    cur_frm.set_value('search_model', null);
                    cur_frm.refresh_field("search_model");
                }

            }
        })
    },
    search_model: function(frm){
        frappe.call({
            method: "car_sale.api.get_color_name",
            args: { search_template: cur_frm.doc.search_template,
                search_category:cur_frm.doc.search_category,
                search_model:cur_frm.doc.search_model
             },
            callback: function (r) {
                if (r.message) {
                    cur_frm.fields_dict.search_color.df.options = r.message;
                    cur_frm.refresh_field("search_color");                  
                }

            }
        })
    },
    add: function(frm){
        if (cur_frm.doc.search_template == undefined || cur_frm.doc.search_template == '') 
        {
            frappe.msgprint(__("Field Brand cannot be empty"));
            return;
        }else if (cur_frm.doc.search_category == undefined || cur_frm.doc.search_category == '') 
        {
            frappe.msgprint(__("Field Category cannot be empty"));
            return;
        }
        else if(cur_frm.doc.search_model == undefined || cur_frm.doc.search_model == '')
        {
            frappe.msgprint(__("Field Model cannot be empty"));
            return;
        } 
        else if(cur_frm.doc.search_color == undefined || cur_frm.doc.search_color == '')
        {
            frappe.msgprint(__("Field Color cannot be empty"));
            return;
        } 

        frappe.call({
            method: "car_sale.api.get_search_item_name",
            args: { search_template: cur_frm.doc.search_template,
                search_category:cur_frm.doc.search_category,
                search_model:cur_frm.doc.search_model,
                search_color:cur_frm.doc.search_color,
             },
            callback: function (r) {
                if (r.message) {
                    if (r.message[0]) {

                        if (cur_frm.doc.items[0]) {
                            if (cur_frm.doc.items[0].item_code==undefined) {
                                cur_frm.doc.items.splice(cur_frm.doc.items[0], 1)
                            }
                        }

                        var child = cur_frm.add_child("items");
                        frappe.model.set_value(child.doctype, child.name, "item_code", r.message[0])
                        cur_frm.refresh_field("items")

                        cur_frm.set_value('search_template', null);

                        cur_frm.fields_dict.search_category.df.options = ''
                        cur_frm.set_value('search_category', null);
                        cur_frm.refresh_field("search_category");

                        cur_frm.fields_dict.search_model.df.options =''
                        cur_frm.set_value('search_model', null);
                        cur_frm.refresh_field("search_model");

                        cur_frm.fields_dict.search_color.df.options=''
                        cur_frm.set_value('search_color', null);
                        cur_frm.refresh_field("search_color")
                    }
                }
            }
        })
    }
});