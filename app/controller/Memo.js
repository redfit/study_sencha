Ext.define('Memo.controller.Memo', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
          main: 'main',
          form: 'memoform'
        },
        control: {
          'button[action=add]': {
            tap: 'onAddButtonTap'
          },
          'memoform textareafield': {
            change: 'onFieldChange'
          },
          'memolist': {
            itemtap: 'onItemTap',
            itemswipe: 'onItemSwipe'
          },
          'button[action=remove]': {
            tap: 'onRemoveButtonTap'
          }
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    },

    onAddButtonTap: function(){
      var record = Ext.create('Memo.model.Memo', {
        id: String(Ext.Date.now());
      });

      var form = this.getForm();

      if (form && form.getRecord()) {
        form.setRecord(record);
        form.down('textareafield').setValue('');

      } else {
        this.getMain().push({
          xtype: 'memoform',
          title: '',
          record: record
        });
      }
    },

    onFieldChange: function(field, value){
      var form = this.getForm(),
        record = form.getRecord();

      record.set('title', Ext.String.ellipsis(value, 10));
      record.set('memo', value);

      var store = Ext.getStore('Memos');
      if (Ext.isEmpty(store.findRecord('id', record.get('id')))) {
        store.add(record);
      }
      store.sync();
    },

    onItemTap: function(list, index, target, record) {
      this.getMain().push({
        xtype: 'memoform',
        record: record,
        title: record.get('title')
      });
    },

    onRemoveButtonTap: function() {
      var form = this.getForm(),
          record = form.getRecord(),
          store = Ext.getStore('Memos');

      store.remove(record);
      store.sync();
      this.getMain().onBackButtonTap();
    },

    onItemSwipe: function(dataview, ix, target, record, event, options) {

      if (event.direction == "left") {
        var del = Ext.create("Ext.Button", {
          ui: "decline",
          text: "Delete",
          style: "position:absolute;top: 10px; right: 15px;",
          handler: function(btn, e) {
            e.stopEvent();
            var store = record.stores[0];
            store.remove(record);
            store.sync();
          }
        });
        var removeDeleteButton = function() {
          Ext.Anim.run(del, 'fade', {
            after: function() {
              del.destroy();
            },
            out: true
          });
        };

        del.renderTo(Ext.DomQuery.selectNode(".deleteplaceholder", target.element.dom));
        dataview.on({
          single: true,
          buffer: 250,
          itemtouchstart: removeDeleteButton
        });
        dataview.element.on({
          single: true,
          buffer: 250,
          touchstart: removeDeleteButton
        });
      }
    }
});
