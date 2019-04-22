<?php

use yii\db\Migration;

class m161003_065943_carriers_content extends Migration
{
    public function up()
    {
        /*for ($i = 0;$i<20;$i++) {
            $this->insert('{{%carriers}}', [
                'name' => 'name_'.$i,
                'users_id' => ($i%3)+1,
                'created_at' => time(),
                'updated_at' => time(),
                'author_id' => (($i+2)%3)+1,
                'updater_id' => (($i+2)%3)+1,
            ]);
        }*/

    }

    public function down()
    {
        echo "m161003_065943_carriers_content cannot be reverted.\n";

        return false;
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
