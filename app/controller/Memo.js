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
          }
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    },

    onAddButtonTap: function(){
      var record = Ext.create('Memo.model.Memo', {
        id: Ext.Date.now()
      });

      this.getMain().push({
        xtype: 'memoform',
        record: record
      });
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
    }
});
