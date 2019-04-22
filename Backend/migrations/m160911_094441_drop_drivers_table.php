<?php
/**
 * Migration for dropping table 'drivers'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 12:48
 */

use yii\db\Migration;

/**
 * Handles the dropping for table `drivers`.
 */
class m160911_094441_drop_drivers_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->dropTable('{{%drivers}}');
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->createTable('{{%drivers}}', [
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
