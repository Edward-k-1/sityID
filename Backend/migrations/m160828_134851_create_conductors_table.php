<?php

use yii\db\Migration;

/**
 * Handles the creation for table `conductors`.
 */
class m160828_134851_create_conductors_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%conductors}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'number' => 'tinyint(4) unsigned DEFAULT NULL',
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
        $this->dropTable('{{%conductors}}');
    }
}
