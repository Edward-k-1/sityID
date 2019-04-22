<?php
/**
 * Migration for creation table 'worker_views'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 13:00
 */

use yii\db\Migration;

/**
 * Handles the creation for table `worker_views`.
 */
class m160911_100023_create_worker_views_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%worker_views}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
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
        $this->dropTable('{{%worker_views}}');
    }
}
