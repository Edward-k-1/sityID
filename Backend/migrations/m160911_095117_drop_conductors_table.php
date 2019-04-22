<?php
/**
 * Migration for dropping table 'drivers'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 12:52
 */

use yii\db\Migration;

/**
 * Handles the dropping for table `conductors`.
 */
class m160911_095117_drop_conductors_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->dropTable('{{%conductors}}');
    }

    /**
     * @inheritdoc
     */
    public function down()
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
}
