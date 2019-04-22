<?php

use yii\db\Migration;

/**
 * Handles the creation for table `carriers`.
 */
class m160828_131343_create_carriers_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%carriers}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'users_id' => $this->integer()->unsigned(),
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
        $this->dropTable('{{%carriers}}');
    }
}
