<?php
/**
 * Migration for creation table 'workers'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 13:00
 */

use yii\db\Migration;

/**
 * Handles the creation for table `workers`.
 */
class m160911_101655_create_workers_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%workers}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'basic_number' => 'int(6) unsigned DEFAULT NULL',
            'company_number' => 'int(6) unsigned DEFAULT NULL',
            'parks_id' => $this->integer()->unsigned(),
            'worker_views_id' => $this->integer()->unsigned(),
            'status' => 'tinyint(1) unsigned DEFAULT NULL',
            'date_added' => $this->date(),
            'date_of_dismissal' => $this->date(),
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
        $this->dropTable('{{%workers}}');
    }
}
