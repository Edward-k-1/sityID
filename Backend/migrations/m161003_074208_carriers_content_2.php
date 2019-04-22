<?php

use yii\db\Migration;

class m161003_074208_carriers_content_2 extends Migration
{
    public function up()
    {
        /*for ($i = 0;$i<2000;$i++) {
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
        echo "m161003_074208_carriers_content_2 cannot be reverted.\n";

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
