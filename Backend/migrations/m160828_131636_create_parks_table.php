<?php

use yii\db\Migration;

/**
 * Handles the creation for table `parks`.
 */
class m160828_131636_create_parks_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%parks}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'carriers_id' => $this->integer()->unsigned(),
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
        $this->dropTable('{{%parks}}');
    }
}
