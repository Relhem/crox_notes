<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function getNotes(Request $request)
    {
        $notes = \App\Note::where('id', '>', 0) -> orderByDesc("created_at") -> get();

        if (isset($notes)){
                    return response()->json([
                        'status' => 'Successfully set.',
                        'notes' => $notes
                    ]);     
        }
    }

    public function addNote(Request $request)
    {
        $note = new \App\Note;
        $note -> creator = $request -> creator;
        $note -> text = $request -> text;
        $note -> name = $request -> name;
        $note -> save();

        return response()->json([
            'status' => 'Successfully added.',
        ]);    
    }

    public function destroy($noteId, Request $request)
    {
        $note = \App\Note::find($noteId);
        if (isset($note)){     
            $note -> delete();
            return response()->json([
                'status' => 'Successfully deleted.'
            ]);
        }
    }

    public function edit($noteId, Request $request)
    {
        $note = \App\Note::find($noteId);
        if (isset($note)){     

            $note -> text = $request -> text;
            $note -> name = $request -> name;
            $note -> save();
            return response()->json([
                'status' => 'Successfully updated.'
            ]);
        }
    }

    public function switchTag($noteId, Request $request)
    {
            $note = \App\Note::find($noteId);
         if (isset($note)){     

            $tags = $note -> tags;
           
            $tag = $request -> tag;
            $arr = explode(' ',trim($tag));
            $tag = $arr[0];

            if (strpos($tags, $tag) !== false) {
                $tags = preg_replace('/ '.$tag.' /', '', $tags, 1);
                $tags = preg_replace('/ '.$tag.'/', '', $tags, 1);
                $tags = preg_replace('/'.$tag.' /', '', $tags, 1);
                $tags = preg_replace('/'.$tag.'/', '', $tags, 1);
            } else
            {
                if ($tags == "")
                $tags = $tag;
                else 
                $tags = $tags." ".$tag;
            }

            $note -> tags = $tags;


            $note -> save();
            return response()->json([
                'tags' => $tags,
                'status' => 'Successfully switched.'
            ]);
        }
    }

}
