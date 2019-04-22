<?php

use yii\db\Migration;

class m160914_062043_add_token_to_user extends Migration
{
    public function up()
    {

        $this->addColumn('{{%users}}','token',$this->string(255)->notNull());
    }

    public function down()
    {
        $this->dropColumn('{{%users}}', 'token');
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
