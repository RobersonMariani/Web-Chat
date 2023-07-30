<?php

namespace App\Events\Chat;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public $message;
    public $userNotification;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message, $userNotification)
    {
        //dd($message, $userNotification);
        $this->message = $message;
        $this->userNotification = $userNotification;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->userNotification),
        ];
    }

    public function broadcastAS()
    {
        return 'SendMessage';
    }

    public function broadcastWith()
    {
        return ['message' => $this->message];
    }
}
