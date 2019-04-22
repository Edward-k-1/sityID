<?php

use yii\db\Migration;

/**
 * Handles the creation for table `frid_type`.
 */
class m161207_081117_create_frid_type_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%rfid_type}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'key' =>  $this->string(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('rfid_type');
    }
}
