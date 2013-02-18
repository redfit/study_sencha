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
            // ダブルタップするとおかしくなるのでシングルにしてみた
            itemsingletap: 'onItemTap',
            itemtouchmove: 'onItemTouchMove'
          },
          'button[action=remove]': {
            tap: 'onRemoveButtonTap'
          }
        }
    },

    onAddButtonTap: function(){
      var record = Ext.create('Memo.model.Memo', {
        id: String(Ext.Date.now())
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

    // スワイプしたあとにボタンが表示されるので
    // スワイプした途端に表示されるようにしたい
    //   出来るようになったが、縦でも表示されちゃうので、横にスワイプした判断方法をどうするか
    onItemTouchMove: function(dataview, ix, target, record, event, options) {

      if(Ext.DomQuery.selectNode(".deleteplaceholder .x-button", target.element.dom)){
        return;
      }

      var del = Ext.create("Ext.Button", {
        ui: "decline",
        text: "Delete",
        style: "position:absolute;top: 10px; right: 15px; display:none",
        // ボタンを押すと他のレコードのボタンも消えちゃうのを何とかしたい
        // レコードを消すと、リストがリフレッシュされちゃうのかな？？
        handler: function(btn, e) {
          e.stopEvent();
          var store = record.stores[0];
          store.remove(record);
          store.sync();
        },
        listeners:{
          // 想定通り（右から左にだんだん表示）にするためには
          // outとdurationが肝だった、たどり着くまで長かった・・・
          show: function(){
            Ext.Anim.run(del, 'wipe', {
              out: false,
              duration: 500
            });
          }
        }
      });

      // 表示アニメーションをかっこ良くしたい
      //   ・スマートな書き方はないか
      del.renderTo(Ext.DomQuery.selectNode(".deleteplaceholder", target.element.dom));
      del.show();
    }
});
