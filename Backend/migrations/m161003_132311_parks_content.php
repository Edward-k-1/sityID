<?php

use yii\db\Migration;

class m161003_132311_parks_content extends Migration
{
    public function up()
    {
        for ($i = 0;$i<200;$i++) {
            $this->insert('{{%parks}}', [
                'name' => 'name_'.$i,
                'carriers_id' => rand(0,300),
                'created_at' => time(),
                'updated_at' => time(),
                'author_id'  => rand(0,3),
                'updater_id' => rand(0,3),
               // 'sync_1c_id' => rand(0,400)
            ]);
        }
    }

    public function down()
    {
        echo "m161003_132311_parks_content cannot be reverted.\n";
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
